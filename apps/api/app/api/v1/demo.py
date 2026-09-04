import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parents[3] / "data"
MEETING_RESULT_PATH = DATA_DIR / "Weekly Meeting Example complete.json"
RECEIPT_IMAGE_PATH = DATA_DIR / "receips" / "receipt_test.jpg"


@router.get("/demo/docs")
def get_document_demo() -> dict:
    return {
        "filename": "Botany-101.pdf",
        "answers": {
            "what is botany?": (
                "Botany is the scientific study of plants, including their structure, "
                "growth, reproduction, evolution and classification."
            ),
            "what are the main parts of a plant?": (
                "The main plant parts are roots, stems, leaves, flowers, fruits and "
                "seeds. Each has a distinct role in support, transport, photosynthesis "
                "or reproduction."
            ),
            "what is photosynthesis?": (
                "Photosynthesis is the process through which plants use sunlight, water "
                "and carbon dioxide to produce glucose and release oxygen."
            ),
        },
    }


@router.get("/demo/meeting")
def get_meeting_demo() -> dict:
    if not MEETING_RESULT_PATH.is_file():
        raise HTTPException(status_code=404, detail="Meeting demo data is unavailable")

    result = json.loads(MEETING_RESULT_PATH.read_text(encoding="utf-8"))
    result["transcript"].setdefault("chapters", [])
    for action_item in result["insights"]["action_items"]:
        if action_item["deadline"] == "null":
            action_item["deadline"] = None
    return result


@router.get("/demo/receipt")
def get_receipt_demo() -> dict:
    if not RECEIPT_IMAGE_PATH.is_file():
        raise HTTPException(status_code=404, detail="Receipt demo data is unavailable")

    return {
        "filename": RECEIPT_IMAGE_PATH.name,
        "image_url": "/api/v1/demo/receipt/image",
        "result": {
            "success": True,
            "total_detections": 5,
            "detections": [
                {
                    "class_id": 6,
                    "class_name": "Title",
                    "confidence": 0.98,
                    "bbox": {"x1": 790, "y1": 205, "x2": 1285, "y2": 275},
                },
                {
                    "class_id": 0,
                    "class_name": "Address",
                    "confidence": 0.96,
                    "bbox": {"x1": 705, "y1": 280, "x2": 1350, "y2": 365},
                },
                {
                    "class_id": 2,
                    "class_name": "Item",
                    "confidence": 0.94,
                    "bbox": {"x1": 565, "y1": 675, "x2": 980, "y2": 915},
                },
                {
                    "class_id": 2,
                    "class_name": "Item",
                    "confidence": 0.95,
                    "bbox": {"x1": 1365, "y1": 675, "x2": 1505, "y2": 915},
                },
                {
                    "class_id": 7,
                    "class_name": "TotalPrice",
                    "confidence": 0.99,
                    "bbox": {"x1": 1350, "y1": 1010, "x2": 1510, "y2": 1075},
                },
            ],
        },
    }


@router.get("/demo/receipt/image")
def get_receipt_demo_image() -> FileResponse:
    if not RECEIPT_IMAGE_PATH.is_file():
        raise HTTPException(status_code=404, detail="Receipt demo image is unavailable")
    return FileResponse(RECEIPT_IMAGE_PATH, media_type="image/jpeg")
