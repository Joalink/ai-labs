"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { PredictionResponse } from "@/types/receipt";

const CLASS_COLORS: Record<string, string> = {
  Address: "#FF6B6B",
  Date: "#4ECDC4",
  Item: "#45B7D1",
  OrderId: "#96CEB4",
  Subtotal: "#FFEAA7",
  Tax: "#DDA0DD",
  Title: "#98D8C8",
  TotalPrice: "#FF8C69",
}

type Props = {
  receipt: PredictionResponse | null;
  preview: string | null
}

export default function ReceiptsCompare({receipt, preview}: Props){
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  return (
    <div className="p-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Original</p>
            {preview && (
              <img
                src={preview}
                alt="original"
                className="w-full rounded shadow"
                onLoad={(e) => setDimensions({
                  width: e.currentTarget.naturalWidth,
                  height: e.currentTarget.naturalHeight,
                })}
              />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Detected</p>
            <div className="relative">
              {preview && (
                <img
                  src={preview}
                  alt="detected"
                  className="w-full rounded shadow"
                />
              )}
              {receipt && dimensions.width > 0 && (
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                  preserveAspectRatio="none"
                >
                  {receipt.detections.map((det, i) => {
                    const color = CLASS_COLORS[det.class_name] ?? "#fff"
                    return (
                      <g key={i}>
                        <rect
                          x={det.bbox.x1}
                          y={det.bbox.y1}
                          width={det.bbox.x2 - det.bbox.x1}
                          height={det.bbox.y2 - det.bbox.y1}
                          fill="none"
                          stroke={color}
                          strokeWidth="4"
                        />
                        <rect
                          x={det.bbox.x1}
                          y={det.bbox.y1 - 22}
                          width={(det.class_name.length + 5) * 8}
                          height="20"
                          fill={color}
                        />
                        <text
                          x={det.bbox.x1 + 4}
                          y={det.bbox.y1 - 7}
                          fill="white"
                          fontSize="13"
                          fontWeight="bold"
                        >
                          {det.class_name} {(det.confidence * 100).toFixed(0)}%
                        </text>
                      </g>
                    )
                  })}
                </svg>
              )}
            </div>
          </div>
        </div>
    </div>
  )
}
