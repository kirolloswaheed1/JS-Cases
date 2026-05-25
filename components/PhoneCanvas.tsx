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
import { findAsset, svgToDataUrl } from '@/lib/assets-library';

interface Props {
  model: PhoneModel;
  caseColor: string;
  backgroundColor: string;
  objects: DesignObject[];
  selectedId: string | null;
  issues: ValidationIssue[];
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, patch: Partial<DesignObject>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
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
      stroke={isSelected ? '#FF4D8D' : undefined}
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
  const asset = findAsset(obj.assetId);
  const dataUrl = asset ? svgToDataUrl(asset.svg, obj.fill) : '';
  const [img] = useImage(dataUrl, 'anonymous');
  const ref = useRef<Konva.Image>(null);
  if (!obj.visible || !asset) return null;
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
  return (
    <KonvaText
      id={obj.id}
      ref={ref}
      x={obj.x}
      y={obj.y}
      text={obj.text}
      fontFamily={obj.fontFamily}
      fontSize={obj.fontSize}
      fill={obj.fill}
      align={obj.align}
      fontStyle={obj.fontStyle}
      letterSpacing={obj.letterSpacing}
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
  caseColor,
  backgroundColor,
  objects,
  selectedId,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
}: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [showSafeArea, setShowSafeArea] = useState(true);

  const [scale, setScale] = useState(1);
  useEffect(() => {
    function recalc() {
      const padding = 32;
      const availableW = Math.min(window.innerWidth - padding, 480);
      const availableH = window.innerHeight - 320;
      const fitW = availableW / model.canvas.width;
      const fitH = availableH / model.canvas.height;
      setScale(Math.min(1, fitW, fitH));
    }
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [model.canvas.width, model.canvas.height]);

  useEffect(() => {
    const stage = stageRef.current;
    const tr = transformerRef.current;
    if (!stage || !tr) return;
    if (!selectedId) {
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
            <Rect
              x={0}
              y={0}
              width={model.canvas.width}
              height={model.canvas.height}
              fill={caseColor}
              cornerRadius={model.safeArea.radius * 1.3}
              shadowColor="rgba(0,0,0,0.12)"
              shadowBlur={12}
              shadowOffsetY={4}
              listening={false}
            />

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
              borderStroke="#FF4D8D"
              borderStrokeWidth={2}
              anchorFill="#FF4D8D"
              anchorStroke="#FFFFFF"
              anchorSize={10}
              anchorCornerRadius={6}
              keepRatio={false}
              boundBoxFunc={(_oldBox, newBox) => {
                if (newBox.width < 10 || newBox.height < 10) return _oldBox;
                return newBox;
              }}
            />
          </Layer>

          {/* Visual guides — NEVER exported. The export pass renders to a fresh
              stage without this layer, so these labels never reach the print file. */}
          <Layer listening={false}>
            {showSafeArea && (
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

            {/* Camera cutout — soft, friendly. Allows overlap; print mask handles it. */}
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
            {/* "Not printed" pill label */}
            <Label
              x={model.cameraCutout.x + model.cameraCutout.width / 2 - 40}
              y={model.cameraCutout.y + model.cameraCutout.height + 8}
            >
              <Tag fill="#0A0A0A" cornerRadius={10} />
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
          </Layer>
        </Stage>

        {selectedId && (
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

      <div className="flex items-center justify-center gap-3 mt-6 text-sm flex-wrap px-4">
        <label className="inline-flex items-center gap-2 text-brand-muted cursor-pointer">
          <input
            type="checkbox"
            checked={showSafeArea}
            onChange={(e) => setShowSafeArea(e.target.checked)}
            className="accent-brand-primary"
          />
          Show safe area
        </label>
        <span className="hidden sm:inline text-brand-stroke">·</span>
        <span className="text-xs text-brand-muted text-center">
          Designs can pass over the camera — that area won't be printed.
        </span>
      </div>
    </div>
  );
}
