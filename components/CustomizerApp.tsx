'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { PHONE_MODELS, DEFAULT_MODEL_ID, getModel } from '@/lib/phone-models';
import { CASE_COLORS, DEFAULT_CASE_COLOR } from '@/lib/case-colors';
import {
  PHONE_COLORS,
  DEFAULT_PHONE_COLOR_ID,
  CUSTOM_PHONE_COLOR_ID,
  getPhoneColor,
} from '@/lib/phone-colors';
import type { DesignObject, ImageObject, TextObject, StickerObject } from '@/lib/design-types';
import { generateDesignId } from '@/lib/design-id';
import { validateDesign, hasBlockingErrors, type ValidationIssue } from '@/lib/validation';
import { exportDesign } from '@/lib/export-design';
import { buildShopifyCartUrl } from '@/lib/shopify';
import type { AssetItem } from '@/lib/assets-library';
import PhoneCanvas from './PhoneCanvas';
import Toolbar from './Toolbar';
import ImageTools from './ImageTools';
import TextTools from './TextTools';
import ProductOptions from './ProductOptions';
import ValidationPanel from './ValidationPanel';
import AddToCartPanel from './AddToCartPanel';
import AssetsPanel from './AssetsPanel';
import LayersPanel from './LayersPanel';
import StepIndicator, { type Step } from './StepIndicator';
import CartSummaryModal from './CartSummaryModal';

type Tab = 'product' | 'upload' | 'text' | 'stickers' | 'colors' | 'layers';

export default function CustomizerApp() {
  const [modelId, setModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [customPhoneModel, setCustomPhoneModel] = useState<string>('');
  const [caseType, setCaseType] = useState<'solid' | 'transparent'>('solid');
  const [caseColor, setCaseColor] = useState<string>(
    CASE_COLORS.find((c) => c.id === DEFAULT_CASE_COLOR)?.hex ?? '#FFFFFF'
  );
  const [backgroundColor, setBackgroundColor] = useState<string>('transparent');
  // Phone (device) color — the color of the customer's actual phone, NOT the case.
  const [phoneColorId, setPhoneColorId] = useState<string>(DEFAULT_PHONE_COLOR_ID);
  const [customPhoneColorHex, setCustomPhoneColorHex] = useState<string>('#888888');
  const [objects, setObjects] = useState<DesignObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('product');
  // Mobile tools drawer — collapsed by default so the phone preview is the focus.
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  // Live drag offset (px) applied on top of the drawer's snapped position.
  // Positive = dragging down, negative = dragging up. Zero when not dragging.
  const [dragOffset, setDragOffset] = useState<number>(0);
  // Drag state held in a ref so pointermove handlers don't re-render on every event.
  const dragStateRef = useRef<{ y: number; openAtStart: boolean; moved: boolean } | null>(null);
  // Preview mode — hides all editor chrome for a clean look before checkout.
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  // Cart summary modal — shown before the final Shopify redirect so the
  // customer can review what's about to be added to their cart.
  const [summaryOpen, setSummaryOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    state: 'idle' | 'exporting' | 'uploading' | 'redirecting' | 'success' | 'error';
    message?: string;
  }>({ state: 'idle' });

  const model = useMemo(() => getModel(modelId), [modelId]);
  // Resolved phone color (id → name + hex). Used by the canvas backdrop,
  // the cart summary, the Shopify properties, and the design JSON.
  const resolvedPhoneColor = useMemo(
    () => getPhoneColor(phoneColorId, customPhoneColorHex),
    [phoneColorId, customPhoneColorHex]
  );
  const issues: ValidationIssue[] = useMemo(
    () => validateDesign(objects, model),
    [objects, model]
  );

  /**
   * Derived "where the customer is in the flow" — drives the step indicator.
   *   - cart    : the summary modal is open or the redirect is in motion
   *   - preview : preview mode is active
   *   - design  : the customer has placed at least one object
   *   - phone   : empty canvas — they're still picking a model
   */
  const currentStep: Step = useMemo(() => {
    if (summaryOpen || status.state === 'redirecting' || status.state === 'success') {
      return 'cart';
    }
    if (previewMode) return 'preview';
    if (objects.length > 0) return 'design';
    return 'phone';
  }, [summaryOpen, status.state, previewMode, objects.length]);
  const blocking = hasBlockingErrors(issues);
  const selected = objects.find((o) => o.id === selectedId) ?? null;

  // On mobile, tapping a tool tab should also open the drawer so the controls show.
  const handleMobileTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setDrawerOpen(true);
  }, []);

  /* ---------------- Drawer drag gesture (mobile) ----------------
   *
   * Attached only to the drawer handle so it never fights with sliders,
   * scrolling stickers, or color pickers inside the drawer body. Uses
   * pointer events (unified mouse/touch) with setPointerCapture so the drag
   * keeps tracking even when the finger leaves the handle.
   *
   * Behavior:
   *   - tap (no movement)         → toggle drawerOpen
   *   - drag down > 50px while open  → close
   *   - drag up   > 50px while closed → open
   *   - smaller drag              → snap back (no state change, dragOffset
   *                                 resets to 0 → CSS transition animates)
   */
  const TAP_MOVEMENT_THRESHOLD = 6;   // px — below this we treat the gesture as a tap
  const DRAG_SNAP_THRESHOLD = 50;     // px — how far past base before we flip state

  const handleHandlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      // Mouse: only respond to left button. Touch / pen: always.
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* setPointerCapture can throw if the pointer is already captured elsewhere — safe to ignore */
      }
      dragStateRef.current = {
        y: e.clientY,
        openAtStart: drawerOpen,
        moved: false,
      };
    },
    [drawerOpen]
  );

  const handleHandlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const ds = dragStateRef.current;
      if (!ds) return;
      const delta = e.clientY - ds.y;
      if (Math.abs(delta) > TAP_MOVEMENT_THRESHOLD) ds.moved = true;
      // Clamp: when the drawer is OPEN, only allow dragging DOWN (positive
      // delta). When CLOSED, only allow dragging UP (negative delta). This
      // prevents the drawer from over-shooting its snapped positions.
      const clamped = ds.openAtStart ? Math.max(0, delta) : Math.min(0, delta);
      setDragOffset(clamped);
    },
    []
  );

  const handleHandlePointerEnd = useCallback(() => {
    const ds = dragStateRef.current;
    if (!ds) return;
    const { openAtStart, moved } = ds;

    if (!moved) {
      // Treated as a tap — toggle.
      setDrawerOpen(!openAtStart);
    } else if (openAtStart && dragOffset > DRAG_SNAP_THRESHOLD) {
      setDrawerOpen(false);
    } else if (!openAtStart && dragOffset < -DRAG_SNAP_THRESHOLD) {
      setDrawerOpen(true);
    }
    // Otherwise the user dragged but not past the threshold → snap back
    // (drawerOpen stays as-is; dragOffset resets below and the CSS
    // transition animates the snap).

    setDragOffset(0);
    dragStateRef.current = null;
  }, [dragOffset]);

  /* ---------------- Object operations ---------------- */

  const addImage = useCallback(
    (src: string, naturalWidth: number, naturalHeight: number) => {
      // Fit image into 60% of safe area
      const maxW = model.safeArea.width * 0.6;
      const maxH = model.safeArea.height * 0.6;
      const ratio = Math.min(maxW / naturalWidth, maxH / naturalHeight, 1);
      const w = naturalWidth * ratio;
      const h = naturalHeight * ratio;

      const newObj: ImageObject = {
        id: `img-${Date.now()}`,
        type: 'image',
        name: 'Image',
        src,
        x: model.safeArea.x + (model.safeArea.width - w) / 2,
        y: model.safeArea.y + (model.safeArea.height - h) / 2,
        width: w,
        height: h,
        naturalWidth,
        naturalHeight,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        locked: false,
        visible: true,
      };
      setObjects((prev) => [...prev, newObj]);
      setSelectedId(newObj.id);
    },
    [model]
  );

  const addText = useCallback(
    (text: string = 'Your text') => {
      const newObj: TextObject = {
        id: `text-${Date.now()}`,
        type: 'text',
        name: 'Text',
        text,
        x: model.safeArea.x + 20,
        y: model.safeArea.y + model.safeArea.height / 2,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        locked: false,
        visible: true,
        fontFamily: 'Poppins',
        fontSize: 48,
        fill: '#0A0A0A',
        align: 'center',
        fontStyle: 'bold',
        letterSpacing: 0,
        width: model.safeArea.width - 40,
        textLayout: 'horizontal',
        lineHeight: 1.2,
      };
      setObjects((prev) => [...prev, newObj]);
      setSelectedId(newObj.id);
    },
    [model]
  );

  const addSticker = useCallback(
    (asset: AssetItem, categoryId: string) => {
      // Drop stickers at ~25% of safe-area width, centered
      const size = Math.round(model.safeArea.width * 0.25);
      const newObj: StickerObject = {
        id: `sticker-${Date.now()}`,
        type: 'sticker',
        name: asset.name,
        assetId: asset.id,
        categoryId,
        src: asset.src,
        x: model.safeArea.x + (model.safeArea.width - size) / 2,
        y: model.safeArea.y + (model.safeArea.height - size) / 2,
        width: size,
        height: size,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        locked: false,
        visible: true,
      };
      setObjects((prev) => [...prev, newObj]);
      setSelectedId(newObj.id);
    },
    [model]
  );

  const updateObject = useCallback((id: string, patch: Partial<DesignObject>) => {
    setObjects((prev) =>
      prev.map((o) => (o.id === id ? ({ ...o, ...patch } as DesignObject) : o))
    );
  }, []);

  const deleteObject = useCallback((id: string) => {
    setObjects((prev) => prev.filter((o) => o.id !== id));
    setSelectedId(null);
  }, []);

  const duplicateObject = useCallback((id: string) => {
    setObjects((prev) => {
      const obj = prev.find((o) => o.id === id);
      if (!obj) return prev;
      const copy: DesignObject = {
        ...obj,
        id: `${obj.type}-${Date.now()}`,
        x: obj.x + 20,
        y: obj.y + 20,
      } as DesignObject;
      return [...prev, copy];
    });
  }, []);

  /** Move a layer up (toward the top / drawn last) or down in the stack. */
  const reorderObject = useCallback((id: string, direction: 'up' | 'down') => {
    setObjects((prev) => {
      const idx = prev.findIndex((o) => o.id === id);
      if (idx === -1) return prev;
      const target = direction === 'up' ? idx + 1 : idx - 1;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  }, []);

  const resetDesign = useCallback(() => {
    if (!confirm('Reset your design? This will remove all objects.')) return;
    setObjects([]);
    setSelectedId(null);
  }, []);

  /* ---------------- Add to cart flow ---------------- */

  /**
   * Validates and opens the summary modal. The actual export + upload +
   * Shopify redirect runs from `handleAddToCart` once the customer confirms
   * in the modal.
   */
  const openSummary = useCallback(() => {
    if (objects.length === 0) {
      alert('Add at least one element to your design first.');
      return;
    }
    if (blocking) {
      alert('Please resolve the errors before adding to cart.');
      return;
    }
    if (model.isOther && customPhoneModel.trim().length === 0) {
      alert('Please type your phone model before adding to cart.');
      return;
    }
    if (model.shopifyVariantId.startsWith('REPLACE_')) {
      alert(
        'This phone model does not yet have a Shopify variant ID configured. The store owner needs to update lib/phone-models.ts.'
      );
      return;
    }
    // Reset any stale status, deselect for a clean preview, open modal.
    setStatus({ state: 'idle' });
    setSelectedId(null);
    setSummaryOpen(true);
  }, [objects.length, blocking, model, customPhoneModel]);

  /**
   * Rows shown in the cart summary modal. Mirrors the Shopify line item
   * properties that will actually be sent — Case Color is only shown for
   * solid cases, Custom Phone Model is only shown for the "Other" option.
   */
  const summaryRows = useMemo(() => {
    const trimmedCustomModel = customPhoneModel.trim().slice(0, 80);
    const caseColorName =
      CASE_COLORS.find((c) => c.hex === caseColor)?.name ?? caseColor;
    const rows: { label: string; value: string }[] = [
      { label: 'Phone Model', value: model.isOther ? 'Other' : model.name },
    ];
    if (model.isOther && trimmedCustomModel) {
      rows.push({ label: 'Custom Phone Model', value: trimmedCustomModel });
    }
    rows.push({
      label: 'Phone Color',
      value:
        phoneColorId === CUSTOM_PHONE_COLOR_ID
          ? `Custom (${resolvedPhoneColor.hex.toUpperCase()})`
          : resolvedPhoneColor.name,
    });
    rows.push({
      label: 'Case Type',
      value: caseType === 'transparent' ? 'Transparent' : 'Solid Color',
    });
    if (caseType === 'solid') {
      rows.push({ label: 'Case Color', value: caseColorName });
    }
    rows.push({ label: 'Customized Case', value: 'Yes' });
    return rows;
  }, [model, caseType, caseColor, customPhoneModel, phoneColorId, resolvedPhoneColor]);

  const handleAddToCart = useCallback(async () => {
    if (objects.length === 0) {
      alert('Add at least one element to your design first.');
      return;
    }
    if (blocking) {
      alert('Please resolve the errors before adding to cart.');
      return;
    }
    if (model.isOther && customPhoneModel.trim().length === 0) {
      alert('Please type your phone model before adding to cart.');
      return;
    }
    if (model.shopifyVariantId.startsWith('REPLACE_')) {
      alert(
        'This phone model does not yet have a Shopify variant ID configured. The store owner needs to update lib/phone-models.ts.'
      );
      return;
    }

    const designId = generateDesignId();
    const trimmedCustomModel = customPhoneModel.trim().slice(0, 80);

    try {
      setStatus({ state: 'exporting', message: 'Preparing print file…' });
      // Hide selection visuals during export by deselecting
      setSelectedId(null);
      // Wait one frame so React commits the deselected state before we render
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      const { previewDataUrl, printDataUrl, designJson } = await exportDesign(
        objects,
        caseType,
        caseColor,
        backgroundColor,
        model,
        designId,
        model.isOther ? trimmedCustomModel : undefined,
        {
          id: resolvedPhoneColor.id,
          name: resolvedPhoneColor.name,
          value: resolvedPhoneColor.hex,
        }
      );

      setStatus({ state: 'uploading', message: 'Uploading design…' });
      const uploadRes = await fetch('/api/upload-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId, previewDataUrl, printDataUrl, designJson }),
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }
      const { previewUrl, printFileUrl, designJsonUrl } = (await uploadRes.json()) as {
        previewUrl: string;
        printFileUrl: string;
        designJsonUrl: string;
      };

      setStatus({
        state: 'redirecting',
        message: 'Your custom case is ready. Redirecting you to checkout…',
      });

      const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'jscases.co';
      const caseColorName =
        CASE_COLORS.find((c) => c.hex === caseColor)?.name ?? caseColor;

      // Build Shopify line item properties. Conditional fields are only
      // included when relevant (e.g. Case Color is omitted for transparent
      // cases; Custom Phone Model is only present for the "Other" option).
      const properties: Record<string, string> = {
        'Customized Case': 'Yes',
        'Phone Model': model.isOther ? 'Other' : model.name,
        'Phone Color':
          phoneColorId === CUSTOM_PHONE_COLOR_ID ? 'Custom' : resolvedPhoneColor.name,
        'Phone Color Hex': resolvedPhoneColor.hex,
        'Case Type': caseType === 'transparent' ? 'Transparent' : 'Solid Color',
        'Design ID': designId,
        'Preview URL': previewUrl,
        'Print File URL': printFileUrl,
        'Editable Design JSON': designJsonUrl,
      };
      if (model.isOther && trimmedCustomModel) {
        properties['Custom Phone Model'] = trimmedCustomModel;
      }
      if (caseType === 'solid') {
        properties['Case Color'] = caseColorName;
      }

      const cartUrl = buildShopifyCartUrl({
        shopDomain,
        variantId: model.shopifyVariantId,
        quantity: 1,
        properties,
      });

      // Brief moment to let the user read the success message
      setTimeout(() => {
        window.location.href = cartUrl;
      }, 800);
    } catch (err) {
      console.error(err);
      setStatus({
        state: 'error',
        message: "We couldn't prepare your design. Please try again.",
      });
    }
  }, [objects, blocking, model, caseType, caseColor, backgroundColor, customPhoneModel, phoneColorId, resolvedPhoneColor]);

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink">
      {/* Preview mode — full-screen, chrome-free, branded */}
      {previewMode && (
        <div className="fixed inset-0 z-50 bg-brand-bg flex flex-col">
          <div className="h-1.5 w-full bg-brand-primary" />
          <div className="flex items-center justify-between px-4 py-3 border-b border-brand-stroke">
            <img src="/js-cases-logo-transparent.png" alt="JS Cases" className="h-10 w-auto" />
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wide">
              Preview
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-auto">
            <p className="text-sm text-brand-ink/70 mb-4 text-center max-w-sm">
              This is how your case will look. The camera area stays open and won't be printed.
            </p>
            <PhoneCanvas
              model={model}
              caseType={caseType}
              caseColor={caseColor}
              phoneBodyColor={resolvedPhoneColor.hex}
              backgroundColor={backgroundColor}
              objects={objects}
              selectedId={null}
              issues={issues}
              onSelect={() => {}}
              onUpdate={() => {}}
              onDelete={() => {}}
              onDuplicate={() => {}}
              preview
            />
          </div>
          <div className="p-4 border-t border-brand-stroke bg-brand-paper">
            <button
              onClick={() => setPreviewMode(false)}
              className="w-full max-w-md mx-auto block font-bold py-3.5 rounded-pill bg-brand-primary text-brand-primary-label shadow-pop hover:bg-brand-primary-hover active:scale-[0.98] transition"
            >
              ← Back to editing
            </button>
          </div>
        </div>
      )}

      {/* Top brand bar */}
      <div className="h-1.5 w-full bg-brand-primary" />

      {/* Header */}
      <header className="bg-brand-bg/95 backdrop-blur border-b border-brand-stroke sticky top-1.5 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <a href="https://jscases.co" className="flex items-center" aria-label="JS Cases — Unique Cases, Built For You">
            <img
              src="/js-cases-logo-transparent.png"
              alt="JS Cases"
              className="h-10 md:h-12 w-auto"
            />
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(true)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:bg-brand-primary hover:text-brand-primary-label transition px-3 py-1.5 rounded-pill border border-brand-primary/40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Preview
            </button>
            <button
              onClick={resetDesign}
              className="text-sm font-semibold text-brand-ink/70 hover:text-brand-primary transition px-3 py-1.5 rounded-pill border border-transparent hover:border-brand-primary/30"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Hero title */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-3 md:pt-10 md:pb-4 text-center">
        <div className="inline-flex items-center gap-1.5 bg-brand-primary text-brand-primary-label text-xs font-bold px-3 py-1 rounded-pill mb-3">
          <span>✨</span> Design your own
        </div>
        <h2 className="font-extrabold text-3xl md:text-5xl tracking-tight text-brand-ink">
          Create Your Own Case
        </h2>
        <p className="text-brand-ink/70 text-sm md:text-base mt-3 max-w-xl mx-auto">
          Upload your photos, add text, add stickers, and design a case that feels
          completely yours.
        </p>
      </div>

      {/* Flow steps */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 pb-3 md:pb-5">
        <StepIndicator
          current={currentStep}
          onStepClick={(s) => {
            if (s === 'phone') {
              setPreviewMode(false);
              setSummaryOpen(false);
              setActiveTab('product');
            } else if (s === 'design') {
              setPreviewMode(false);
              setSummaryOpen(false);
            } else if (s === 'preview') {
              setSummaryOpen(false);
              setPreviewMode(true);
            } else if (s === 'cart') {
              openSummary();
            }
          }}
        />
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 pb-20 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-4 lg:gap-6">
          {/* Left column — tools (desktop only) */}
          <aside className="hidden lg:block">
            <Toolbar activeTab={activeTab} onChange={setActiveTab} />
            <div className="mt-4">
              {activeTab === 'product' && (
                <ProductOptions
                  modelId={modelId}
                  customPhoneModel={customPhoneModel}
                  phoneColorId={phoneColorId}
                  customPhoneColorHex={customPhoneColorHex}
                  caseType={caseType}
                  caseColor={caseColor}
                  backgroundColor={backgroundColor}
                  onModelChange={setModelId}
                  onCustomPhoneModelChange={setCustomPhoneModel}
                  onPhoneColorChange={setPhoneColorId}
                  onCustomPhoneColorHexChange={setCustomPhoneColorHex}
                  onCaseTypeChange={setCaseType}
                  onCaseColorChange={setCaseColor}
                  onBackgroundChange={setBackgroundColor}
                />
              )}
              {activeTab === 'upload' && (
                <ImageTools onAddImage={addImage} />
              )}
              {activeTab === 'text' && (
                <TextTools
                  onAddText={addText}
                  selected={selected?.type === 'text' ? selected : null}
                  onUpdate={(patch) => selected && updateObject(selected.id, patch)}
                />
              )}
              {activeTab === 'stickers' && (
                <AssetsPanel
                  onAddSticker={addSticker}
                  selected={selected?.type === 'sticker' ? selected : null}
                  onUpdate={(patch) => selected && updateObject(selected.id, patch)}
                />
              )}
              {activeTab === 'colors' && (
                <ProductOptions
                  modelId={modelId}
                  customPhoneModel={customPhoneModel}
                  phoneColorId={phoneColorId}
                  customPhoneColorHex={customPhoneColorHex}
                  caseType={caseType}
                  caseColor={caseColor}
                  backgroundColor={backgroundColor}
                  onModelChange={setModelId}
                  onCustomPhoneModelChange={setCustomPhoneModel}
                  onPhoneColorChange={setPhoneColorId}
                  onCustomPhoneColorHexChange={setCustomPhoneColorHex}
                  onCaseTypeChange={setCaseType}
                  onCaseColorChange={setCaseColor}
                  onBackgroundChange={setBackgroundColor}
                  showOnlyColors
                />
              )}
              {activeTab === 'layers' && (
                <LayersPanel
                  objects={objects}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onUpdate={updateObject}
                  onDelete={deleteObject}
                  onReorder={reorderObject}
                />
              )}
            </div>
          </aside>

          {/* Center — canvas */}
          <main className="flex flex-col items-center">
            <PhoneCanvas
              model={model}
              caseType={caseType}
              caseColor={caseColor}
              phoneBodyColor={resolvedPhoneColor.hex}
              backgroundColor={backgroundColor}
              objects={objects}
              selectedId={selectedId}
              issues={issues}
              onSelect={setSelectedId}
              onUpdate={updateObject}
              onDelete={deleteObject}
              onDuplicate={duplicateObject}
            />
          </main>

          {/* Right column — validation + add to cart */}
          <aside className="hidden lg:block space-y-4">
            <ValidationPanel issues={issues} />
            <AddToCartPanel
              model={model}
              caseColor={caseColor}
              objectCount={objects.length}
              status={status}
              disabled={blocking}
              onAdd={openSummary}
            />
          </aside>
        </div>
      </div>

      {/* Mobile tools drawer — slides up from the bottom like a shutter.
          Collapsed: only the handle peeks above the bottom of the screen,
          so the phone preview remains the main focus.
          Expanded: drawer translates up to reveal tabs, tool controls, and
          the Add to Cart panel. Content scrolls internally inside the
          expanded drawer; phone preview stays visible above it. */}
      <div className="lg:hidden">
        {/* Dimmer behind the expanded drawer */}
        <div
          className={`fixed inset-0 z-20 transition-opacity duration-300 ease-out bg-black/25 ${
            drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />

        <div
          className="fixed bottom-0 left-0 right-0 bg-brand-paper border-t border-brand-stroke shadow-pop z-30 rounded-t-card flex flex-col"
          style={{
            // Cap total drawer height so the phone preview stays the focus.
            // Lower than the previous 78vh — most of the viewport now goes to
            // the design canvas; tool content scrolls internally if needed.
            maxHeight: '50vh',
            // Shutter slide: collapsed pushes everything off-screen except the
            // ~52px handle row at the top of the drawer. The `dragOffset`
            // chain layers the live finger position on top of the snapped
            // position; both are translateY so they compose naturally.
            transform: `translateY(${
              drawerOpen ? '0px' : 'calc(100% - 52px)'
            }) translateY(${dragOffset}px)`,
            // Disable the smooth transition while the user is actively
            // dragging — they should feel a 1:1 connection between finger
            // and drawer. When the drag ends (dragOffset → 0) the transition
            // kicks back in and animates the snap.
            transition:
              dragOffset !== 0
                ? 'none'
                : 'transform 320ms cubic-bezier(0.32, 0.72, 0, 1)',
            willChange: 'transform',
          }}
          aria-hidden={!drawerOpen}
        >
          {/* Drawer handle — tap to toggle, OR drag with finger.
              touchAction:none stops the browser from scrolling the page
              while the user is dragging on the handle. */}
          <button
            type="button"
            onPointerDown={handleHandlePointerDown}
            onPointerMove={handleHandlePointerMove}
            onPointerUp={handleHandlePointerEnd}
            onPointerCancel={handleHandlePointerEnd}
            onKeyDown={(e) => {
              // Keep keyboard accessibility — pointer handlers replace onClick.
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDrawerOpen((v) => !v);
              }
            }}
            className="shrink-0 w-full flex flex-col items-center pt-2.5 pb-1.5 active:bg-brand-cream/60 rounded-t-card cursor-grab active:cursor-grabbing select-none"
            style={{ touchAction: 'none' }}
            aria-expanded={drawerOpen}
            aria-controls="tools-drawer-content"
            aria-label={drawerOpen ? 'Hide tools' : 'Show tools'}
          >
            {/* Drag bar — slightly chunkier and brand-tinted to invite the gesture */}
            <span className="w-12 h-1.5 rounded-pill bg-brand-primary/40 mb-1.5" />
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary">
              {drawerOpen ? 'Hide tools' : 'Tools'}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{
                  transform: drawerOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 250ms ease-out',
                }}
              >
                <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

          {/* Scrollable drawer body — tabs + active tool panel + add to cart.
              This whole block is below the fold when the drawer is collapsed
              (pushed off-screen by the translateY above). Internal scroll
              when content exceeds the available height. */}
          <div
            id="tools-drawer-content"
            className="flex-1 overflow-y-auto scrollbar-thin"
          >
            <div className="px-3 pt-1">
              <Toolbar activeTab={activeTab} onChange={handleMobileTab} mobile />
            </div>

            <div className="px-3 py-3 max-h-[35vh] overflow-y-auto scrollbar-thin">
              {activeTab === 'product' && (
                <ProductOptions
                  modelId={modelId}
                  customPhoneModel={customPhoneModel}
                  phoneColorId={phoneColorId}
                  customPhoneColorHex={customPhoneColorHex}
                  caseType={caseType}
                  caseColor={caseColor}
                  backgroundColor={backgroundColor}
                  onModelChange={setModelId}
                  onCustomPhoneModelChange={setCustomPhoneModel}
                  onPhoneColorChange={setPhoneColorId}
                  onCustomPhoneColorHexChange={setCustomPhoneColorHex}
                  onCaseTypeChange={setCaseType}
                  onCaseColorChange={setCaseColor}
                  onBackgroundChange={setBackgroundColor}
                />
              )}
              {activeTab === 'upload' && <ImageTools onAddImage={addImage} />}
              {activeTab === 'text' && (
                <TextTools
                  onAddText={addText}
                  selected={selected?.type === 'text' ? selected : null}
                  onUpdate={(patch) => selected && updateObject(selected.id, patch)}
                />
              )}
              {activeTab === 'stickers' && (
                <AssetsPanel
                  onAddSticker={addSticker}
                  selected={selected?.type === 'sticker' ? selected : null}
                  onUpdate={(patch) => selected && updateObject(selected.id, patch)}
                />
              )}
              {activeTab === 'colors' && (
                <ProductOptions
                  modelId={modelId}
                  customPhoneModel={customPhoneModel}
                  phoneColorId={phoneColorId}
                  customPhoneColorHex={customPhoneColorHex}
                  caseType={caseType}
                  caseColor={caseColor}
                  backgroundColor={backgroundColor}
                  onModelChange={setModelId}
                  onCustomPhoneModelChange={setCustomPhoneModel}
                  onPhoneColorChange={setPhoneColorId}
                  onCustomPhoneColorHexChange={setCustomPhoneColorHex}
                  onCaseTypeChange={setCaseType}
                  onCaseColorChange={setCaseColor}
                  onBackgroundChange={setBackgroundColor}
                  showOnlyColors
                />
              )}
              {activeTab === 'layers' && (
                <LayersPanel
                  objects={objects}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onUpdate={updateObject}
                  onDelete={deleteObject}
                  onReorder={reorderObject}
                />
              )}
            </div>

            {/* Bottom bar: validation + Add to Cart, inside the drawer body
                so the whole shutter slides together. When the drawer is
                collapsed these are off-screen along with everything else. */}
            <div className="border-t border-brand-stroke px-3 py-3 bg-brand-paper">
              <ValidationPanel issues={issues} compact />
              <div className="mt-2">
                <AddToCartPanel
                  model={model}
                  caseColor={caseColor}
                  objectCount={objects.length}
                  status={status}
                  disabled={blocking}
                  onAdd={openSummary}
                  compact
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final review before redirecting to Shopify checkout */}
      <CartSummaryModal
        open={summaryOpen}
        rows={summaryRows}
        busy={
          status.state === 'exporting' ||
          status.state === 'uploading' ||
          status.state === 'redirecting'
        }
        busyMessage={status.message}
        onConfirm={handleAddToCart}
        onCancel={() => setSummaryOpen(false)}
      />
    </div>
  );
}
