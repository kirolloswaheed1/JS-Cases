'use client';

import { useCallback, useMemo, useState } from 'react';
import { PHONE_MODELS, DEFAULT_MODEL_ID, getModel } from '@/lib/phone-models';
import { CASE_COLORS, DEFAULT_CASE_COLOR } from '@/lib/case-colors';
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
  const [objects, setObjects] = useState<DesignObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('product');
  // Mobile tools drawer — collapsed by default so the phone preview is the focus.
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
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
      label: 'Case Type',
      value: caseType === 'transparent' ? 'Transparent' : 'Solid Color',
    });
    if (caseType === 'solid') {
      rows.push({ label: 'Case Color', value: caseColorName });
    }
    rows.push({ label: 'Customized Case', value: 'Yes' });
    return rows;
  }, [model, caseType, caseColor, customPhoneModel]);

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
        model.isOther ? trimmedCustomModel : undefined
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
  }, [objects, blocking, model, caseType, caseColor, backgroundColor, customPhoneModel]);

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
      <div className="max-w-7xl mx-auto px-3 md:px-6 pb-44 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-4 lg:gap-6">
          {/* Left column — tools (desktop only) */}
          <aside className="hidden lg:block">
            <Toolbar activeTab={activeTab} onChange={setActiveTab} />
            <div className="mt-4">
              {activeTab === 'product' && (
                <ProductOptions
                  modelId={modelId}
                  customPhoneModel={customPhoneModel}
                  caseType={caseType}
                  caseColor={caseColor}
                  backgroundColor={backgroundColor}
                  onModelChange={setModelId}
                  onCustomPhoneModelChange={setCustomPhoneModel}
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
                  caseType={caseType}
                  caseColor={caseColor}
                  backgroundColor={backgroundColor}
                  onModelChange={setModelId}
                  onCustomPhoneModelChange={setCustomPhoneModel}
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

      {/* Mobile tools drawer — collapsible so the phone preview stays the focus */}
      <div className="lg:hidden">
        {/* Dimmer behind the expanded drawer */}
        {drawerOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        <div
          className={`fixed bottom-0 left-0 right-0 bg-brand-paper border-t border-brand-stroke shadow-soft z-30 rounded-t-card transition-transform duration-300 ease-out ${
            drawerOpen ? 'translate-y-0' : 'translate-y-0'
          }`}
        >
          {/* Drawer handle / toggle */}
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            className="w-full flex flex-col items-center pt-2 pb-1 active:bg-brand-cream/60 rounded-t-card"
            aria-expanded={drawerOpen}
            aria-label={drawerOpen ? 'Hide tools' : 'Show tools'}
          >
            <span className="w-10 h-1.5 rounded-pill bg-brand-stroke mb-1" />
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary">
              Tools
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ transform: drawerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
                <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

          {/* Tabs — always visible */}
          <div className="px-3 pb-2">
            <Toolbar activeTab={activeTab} onChange={handleMobileTab} mobile />
          </div>

          {/* Expandable tool controls — only mounted when open */}
          {drawerOpen && (
            <div className="px-3 pb-3 max-h-[45vh] overflow-y-auto scrollbar-thin">
              {activeTab === 'product' && (
                <ProductOptions
                  modelId={modelId}
                  customPhoneModel={customPhoneModel}
                  caseType={caseType}
                  caseColor={caseColor}
                  backgroundColor={backgroundColor}
                  onModelChange={setModelId}
                  onCustomPhoneModelChange={setCustomPhoneModel}
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
                  caseType={caseType}
                  caseColor={caseColor}
                  backgroundColor={backgroundColor}
                  onModelChange={setModelId}
                  onCustomPhoneModelChange={setCustomPhoneModel}
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
          )}

          {/* Always-visible bottom bar: validation + add to cart */}
          <div className="border-t border-brand-stroke px-3 py-3 bg-brand-paper">
            {drawerOpen && <ValidationPanel issues={issues} compact />}
            <div className={drawerOpen ? 'mt-2' : ''}>
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
