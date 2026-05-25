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

type Tab = 'product' | 'upload' | 'text' | 'stickers' | 'colors';

export default function CustomizerApp() {
  const [modelId, setModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [caseColor, setCaseColor] = useState<string>(
    CASE_COLORS.find((c) => c.id === DEFAULT_CASE_COLOR)?.hex ?? '#FFFFFF'
  );
  const [backgroundColor, setBackgroundColor] = useState<string>('transparent');
  const [objects, setObjects] = useState<DesignObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('product');
  const [status, setStatus] = useState<{
    state: 'idle' | 'exporting' | 'uploading' | 'redirecting' | 'success' | 'error';
    message?: string;
  }>({ state: 'idle' });

  const model = useMemo(() => getModel(modelId), [modelId]);
  const issues: ValidationIssue[] = useMemo(
    () => validateDesign(objects, model),
    [objects, model]
  );
  const blocking = hasBlockingErrors(issues);
  const selected = objects.find((o) => o.id === selectedId) ?? null;

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
        x: model.safeArea.x + (model.safeArea.width - size) / 2,
        y: model.safeArea.y + (model.safeArea.height - size) / 2,
        width: size,
        height: size,
        fill: asset.defaultColor || '#0A0A0A',
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

  const resetDesign = useCallback(() => {
    if (!confirm('Reset your design? This will remove all objects.')) return;
    setObjects([]);
    setSelectedId(null);
  }, []);

  /* ---------------- Add to cart flow ---------------- */

  const handleAddToCart = useCallback(async () => {
    if (objects.length === 0) {
      alert('Add at least one element to your design first.');
      return;
    }
    if (blocking) {
      alert('Please resolve the errors before adding to cart.');
      return;
    }
    if (model.shopifyVariantId.startsWith('REPLACE_')) {
      alert(
        'This phone model does not yet have a Shopify variant ID configured. The store owner needs to update lib/phone-models.ts.'
      );
      return;
    }

    const designId = generateDesignId();

    try {
      setStatus({ state: 'exporting', message: 'Preparing print file…' });
      // Hide selection visuals during export by deselecting
      setSelectedId(null);
      // Wait one frame so React commits the deselected state before we render
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      const { previewDataUrl, printDataUrl, designJson } = await exportDesign(
        objects,
        caseColor,
        backgroundColor,
        model,
        designId
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

      const cartUrl = buildShopifyCartUrl({
        shopDomain,
        variantId: model.shopifyVariantId,
        quantity: 1,
        properties: {
          'Customized Case': 'Yes',
          'Phone Model': model.name,
          'Case Color': caseColorName,
          'Design ID': designId,
          'Preview URL': previewUrl,
          'Print File URL': printFileUrl,
          'Editable Design JSON': designJsonUrl,
        },
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
  }, [objects, blocking, model, caseColor, backgroundColor]);

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink">
      {/* Top brand bar */}
      <div className="h-1.5 w-full bg-brand-primary" />

      {/* Header */}
      <header className="bg-brand-bg/95 backdrop-blur border-b border-brand-stroke sticky top-1.5 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <a href="https://jscases.co" className="flex items-center" aria-label="JS Cases">
            {/* Replace /js-cases-logo.svg with your real logo file (PNG or SVG) in /public */}
            <img
              src="/js-cases-logo.svg"
              alt="JS Cases"
              className="h-7 md:h-9 w-auto"
            />
          </a>
          <div className="flex items-center gap-3">
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
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-3 md:pt-10 md:pb-6 text-center">
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

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 pb-32 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-4 lg:gap-6">
          {/* Left column — tools (desktop only) */}
          <aside className="hidden lg:block">
            <Toolbar activeTab={activeTab} onChange={setActiveTab} />
            <div className="mt-4">
              {activeTab === 'product' && (
                <ProductOptions
                  modelId={modelId}
                  caseColor={caseColor}
                  backgroundColor={backgroundColor}
                  onModelChange={setModelId}
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
                  caseColor={caseColor}
                  backgroundColor={backgroundColor}
                  onModelChange={setModelId}
                  onCaseColorChange={setCaseColor}
                  onBackgroundChange={setBackgroundColor}
                  showOnlyColors
                />
              )}
            </div>
          </aside>

          {/* Center — canvas */}
          <main className="flex flex-col items-center">
            <PhoneCanvas
              model={model}
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
              onAdd={handleAddToCart}
            />
          </aside>
        </div>
      </div>

      {/* Mobile bottom sheet: tools + add to cart */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-stroke shadow-soft z-10">
        <div className="px-3 pt-2 pb-1">
          <Toolbar activeTab={activeTab} onChange={setActiveTab} mobile />
        </div>
        <div className="px-3 pb-3 max-h-[44vh] overflow-y-auto scrollbar-thin">
          {activeTab === 'product' && (
            <ProductOptions
              modelId={modelId}
              caseColor={caseColor}
              backgroundColor={backgroundColor}
              onModelChange={setModelId}
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
              caseColor={caseColor}
              backgroundColor={backgroundColor}
              onModelChange={setModelId}
              onCaseColorChange={setCaseColor}
              onBackgroundChange={setBackgroundColor}
              showOnlyColors
            />
          )}
        </div>
        <div className="border-t border-brand-stroke px-3 py-3 bg-brand-paper">
          <ValidationPanel issues={issues} compact />
          <div className="mt-2">
            <AddToCartPanel
              model={model}
              caseColor={caseColor}
              objectCount={objects.length}
              status={status}
              disabled={blocking}
              onAdd={handleAddToCart}
              compact
            />
          </div>
        </div>
      </div>
    </div>
  );
}
