'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
  Text as KonvaText,
  Transformer,
  Group,
  Label,
  Tag,
} from 'react-konva';
import type Konva from 'konva';
import useImage from 'use-image';
import type { PhoneModel } from '@/lib/phone-models';
import type { DesignObject, ImageObject, TextObject, StickerObject } from '@/lib/design-types';
import type { ValidationIssue } from '@/lib/validation';
import { findAsset } from '@/lib/assets-library';
import { applyTextLayout } from '@/lib/text-layout';

interface Props {
  model: PhoneModel;
  caseType: 'solid' | 'transparent';
  caseColor: string;
  backgroundColor: string;
  objects: DesignObject[];
  selectedId: string | null;
  issues: ValidationIssue[];
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, patch: Partial<DesignObject>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  /** Preview mode: hide all editor chrome (handles, safe area, helper UI) and disable editing. */
  preview?: boolean;
}

/**
 * Renders the phone-case mockup outline as an overlay on top of the design.
 * Non-interactive: pointer events fall through to the design objects below.
 * Returns null silently if the model has no mockupImage (Samsung / Other use
 * the generic rounded-rect case fallback).
 */
function MockupOverlay({
  src,
  width,
  height,
}: {
  src: string | undefined;
  width: number;
  height: number;
}) {
  const [img] = useImage(src ?? '', 'anonymous');
  if (!src || !img) return null;
  return (
    <KonvaImage
      image={img}
      x={0}
      y={0}
      width={width}
      height={height}
      listening={false}
    />
  );
}

function ImageNode({
  obj,
  onSelect,
  onChange,
  isSelected,
}: {
  obj: ImageObject;
  onSelect: () => void;
  onChange: (patch: Partial<DesignObject>) => void;
  isSelected: boolean;
}) {
  const [img] = useImage(obj.src, 'anonymous');
  const ref = useRef<Konva.Image>(null);
  if (!obj.visible) return null;
  return (
    <KonvaImage
      id={obj.id}
      ref={ref}
      image={img}
      x={obj.x}
      y={obj.y}
      width={obj.width}
      height={obj.height}
      scaleX={obj.scaleX}
      scaleY={obj.scaleY}
      rotation={obj.rotation}
      opacity={obj.opacity}
      draggable={!obj.locked}
      onMouseDown={onSelect}
      onTouchStart={onSelect}
      onTap={onSelect}
      onClick={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={() => {
        const node = ref.current;
        if (!node) return;
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        });
      }}
      stroke={isSelected ? '#690001' : undefined}
      strokeWidth={isSelected ? 1.5 / Math.max(obj.scaleX, 0.1) : 0}
    />
  );
}

function StickerNode({
  obj,
  onSelect,
  onChange,
}: {
  obj: StickerObject;
  onSelect: () => void;
  onChange: (patch: Partial<DesignObject>) => void;
}) {
  // Prefer the snapshot src on the object (works even if the asset was later
  // removed from the catalog), falling back to a fresh catalog lookup.
  const asset = findAsset(obj.assetId);
  const src = obj.src || asset?.src || '';
  const [img] = useImage(src, 'anonymous');
  const ref = useRef<Konva.Image>(null);
  if (!obj.visible || !src) return null;
  return (
    <KonvaImage
      id={obj.id}
      ref={ref}
      image={img}
      x={obj.x}
      y={obj.y}
      width={obj.width}
      height={obj.height}
      scaleX={obj.scaleX}
      scaleY={obj.scaleY}
      rotation={obj.rotation}
      opacity={obj.opacity}
      draggable={!obj.locked}
      onMouseDown={onSelect}
      onTouchStart={onSelect}
      onTap={onSelect}
      onClick={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={() => {
        const node = ref.current;
        if (!node) return;
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        });
      }}
    />
  );
}

function TextNode({
  obj,
  onSelect,
  onChange,
}: {
  obj: TextObject;
  onSelect: () => void;
  onChange: (patch: Partial<DesignObject>) => void;
}) {
  const ref = useRef<Konva.Text>(null);
  if (!obj.visible) return null;
  const displayText = applyTextLayout(obj.text, obj.textLayout ?? 'horizontal');
  return (
    <KonvaText
      id={obj.id}
      ref={ref}
      x={obj.x}
      y={obj.y}
      text={displayText}
      fontFamily={obj.fontFamily}
      fontSize={obj.fontSize}
      fill={obj.fill}
      align={obj.align}
      fontStyle={obj.fontStyle}
      letterSpacing={obj.letterSpacing}
      lineHeight={obj.lineHeight ?? 1.2}
      width={obj.width}
      scaleX={obj.scaleX}
      scaleY={obj.scaleY}
      rotation={obj.rotation}
      opacity={obj.opacity}
      draggable={!obj.locked}
      onMouseDown={onSelect}
      onTouchStart={onSelect}
      onTap={onSelect}
      onClick={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={() => {
        const node = ref.current;
        if (!node) return;
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        });
      }}
    />
  );
}

export default function PhoneCanvas({
  model,
  caseType,
  caseColor,
  backgroundColor,
  objects,
  selectedId,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  preview = false,
}: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [showSafeArea, setShowSafeArea] = useState(true);

  const [scale, setScale] = useState(1);
  useEffect(() => {
    function recalc() {
      const padding = 32;
      const availableW = Math.min(window.innerWidth - padding, 480);
      // Preview mode has no tools drawer, so the case can use more vertical space.
      const availableH = window.innerHeight - (preview ? 200 : 320);
      const fitW = availableW / model.canvas.width;
      const fitH = availableH / model.canvas.height;
      setScale(Math.min(1, fitW, fitH));
    }
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [model.canvas.width, model.canvas.height, preview]);

  useEffect(() => {
    const stage = stageRef.current;
    const tr = transformerRef.current;
    if (!stage || !tr) return;
    if (preview || !selectedId) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }
    const node = stage.findOne(`#${selectedId}`);
    if (node) {
      tr.nodes([node as Konva.Node]);
      tr.getLayer()?.batchDraw();
    } else {
      tr.nodes([]);
    }
  }, [selectedId, objects]);

  return (
    <div className="w-full">
      <div
        className="relative mx-auto rounded-card p-4 bg-brand-paper border border-brand-stroke shadow-card"
        style={{ width: model.canvas.width * scale + 32 }}
      >
        <Stage
          ref={stageRef}
          width={model.canvas.width * scale}
          height={model.canvas.height * scale}
          scaleX={scale}
          scaleY={scale}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) onSelect(null);
          }}
          onTouchStart={(e) => {
            if (e.target === e.target.getStage()) onSelect(null);
          }}
        >
          <Layer>
            {caseType === 'transparent' ? (
              /* Clear case: when there's a mockupImage we let the outline
                 in the mockup overlay communicate the case shape — drawing
                 our own dashed rect on top would double-up. Without a mockup
                 we keep the subtle tint + dashed outline so the case is still
                 visible in the editor. Print export skips this entirely. */
              model.mockupImage ? null : (
                <Rect
                  x={0}
                  y={0}
                  width={model.canvas.width}
                  height={model.canvas.height}
                  fill="rgba(255,255,255,0.10)"
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth={1.5}
                  dash={[10, 6]}
                  cornerRadius={model.safeArea.radius * 1.3}
                  shadowColor="rgba(0,0,0,0.10)"
                  shadowBlur={10}
                  shadowOffsetY={3}
                  listening={false}
                />
              )
            ) : (
              /* Solid case: when a mockup is present we inset the colored
                 rect slightly so the tint stays inside the case outline.
                 Without a mockup we render the full canvas as before. */
              <Rect
                x={model.mockupImage ? model.canvas.width * 0.03 : 0}
                y={model.mockupImage ? model.canvas.height * 0.02 : 0}
                width={
                  model.mockupImage
                    ? model.canvas.width * 0.94
                    : model.canvas.width
                }
                height={
                  model.mockupImage
                    ? model.canvas.height * 0.96
                    : model.canvas.height
                }
                fill={caseColor}
                cornerRadius={model.safeArea.radius * 1.3}
                shadowColor="rgba(0,0,0,0.12)"
                shadowBlur={12}
                shadowOffsetY={4}
                listening={false}
              />
            )}

            {backgroundColor !== 'transparent' && (
              <Rect
                x={0}
                y={0}
                width={model.canvas.width}
                height={model.canvas.height}
                fill={backgroundColor}
                cornerRadius={model.safeArea.radius * 1.3}
                listening={false}
              />
            )}

            <Group>
              {objects.map((obj) => {
                const isSelected = selectedId === obj.id;
                if (obj.type === 'image') {
                  return (
                    <ImageNode
                      key={obj.id}
                      obj={obj}
                      isSelected={isSelected}
                      onSelect={() => !obj.locked && onSelect(obj.id)}
                      onChange={(patch) => onUpdate(obj.id, patch)}
                    />
                  );
                }
                if (obj.type === 'sticker') {
                  return (
                    <StickerNode
                      key={obj.id}
                      obj={obj}
                      onSelect={() => !obj.locked && onSelect(obj.id)}
                      onChange={(patch) => onUpdate(obj.id, patch)}
                    />
                  );
                }
                return (
                  <TextNode
                    key={obj.id}
                    obj={obj}
                    onSelect={() => !obj.locked && onSelect(obj.id)}
                    onChange={(patch) => onUpdate(obj.id, patch)}
                  />
                );
              })}
            </Group>

            <Transformer
              ref={transformerRef}
              rotateEnabled
              borderStroke="#690001"
              borderStrokeWidth={2}
              anchorFill="#690001"
              anchorStroke="#FFFFFF"
              anchorSize={14}
              anchorCornerRadius={7}
              keepRatio={false}
              boundBoxFunc={(_oldBox, newBox) => {
                if (newBox.width < 10 || newBox.height < 10) return _oldBox;
                return newBox;
              }}
            />
          </Layer>

          {/* Mockup outline overlay — sits on top of the design so the case
              shape frames the artwork. Non-interactive (listening=false).
              When the model has no mockupImage (Samsung / Other) this renders
              nothing and the rounded-rect case fill underneath shows through. */}
          <Layer listening={false}>
            <MockupOverlay
              src={model.mockupImage}
              width={model.canvas.width}
              height={model.canvas.height}
            />
          </Layer>

          {/* Visual guides — NEVER exported. The export pass renders to a fresh
              stage without this layer, so these labels never reach the print file. */}
          <Layer listening={false}>
            {!preview && showSafeArea && (
              <Rect
                x={model.safeArea.x}
                y={model.safeArea.y}
                width={model.safeArea.width}
                height={model.safeArea.height}
                cornerRadius={model.safeArea.radius}
                stroke="#0A0A0A"
                strokeWidth={1}
                dash={[6, 4]}
                opacity={0.2}
              />
            )}

            {/* Camera cutout — soft, friendly. Allows overlap; print mask handles it.
                Shown in both edit and preview (it's a physical case feature). */}
            <Rect
              x={model.cameraCutout.x}
              y={model.cameraCutout.y}
              width={model.cameraCutout.width}
              height={model.cameraCutout.height}
              cornerRadius={model.cameraCutout.radius}
              fill="rgba(255,255,255,0.5)"
            />
            <Rect
              x={model.cameraCutout.x}
              y={model.cameraCutout.y}
              width={model.cameraCutout.width}
              height={model.cameraCutout.height}
              cornerRadius={model.cameraCutout.radius}
              stroke="#0A0A0A"
              strokeWidth={1.5}
              dash={[8, 6]}
              opacity={0.6}
            />
            {/* "Not printed" pill label — edit mode only */}
            {!preview && (
              <Label
                x={model.cameraCutout.x + model.cameraCutout.width / 2 - 40}
                y={model.cameraCutout.y + model.cameraCutout.height + 8}
              >
                <Tag fill="#690001" cornerRadius={10} />
                <KonvaText
                  text="Not printed"
                  fontFamily="Poppins"
                  fontSize={11}
                  fontStyle="bold"
                  fill="#FFFFFF"
                  padding={6}
                  width={80}
                  align="center"
                />
              </Label>
            )}
          </Layer>
        </Stage>

        {!preview && selectedId && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 translate-y-full bg-white border border-brand-stroke rounded-pill shadow-soft px-2 py-1 flex items-center gap-1 z-10">
            <button
              title="Duplicate"
              onClick={() => onDuplicate(selectedId)}
              className="w-9 h-9 rounded-pill hover:bg-brand-primary-soft flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
            </button>
            <button
              title="Delete"
              onClick={() => onDelete(selectedId)}
              className="w-9 h-9 rounded-pill hover:bg-red-50 text-red-500 flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {!preview && (
        <div className="flex items-center justify-center gap-3 mt-6 text-sm flex-wrap px-4">
          <label className="inline-flex items-center gap-2 text-brand-muted cursor-pointer">
            <input
              type="checkbox"
              checked={showSafeArea}
              onChange={(e) => setShowSafeArea(e.target.checked)}
              className="accent-brand-primary w-4 h-4"
            />
            Show safe area
          </label>
          <span className="hidden sm:inline text-brand-stroke">·</span>
          <span className="text-xs text-brand-muted text-center">
            Camera area — this part will not be printed.
          </span>
        </div>
      )}
    </div>
  );
}
