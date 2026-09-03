from fastapi import (
    APIRouter,
    BackgroundTasks,
    Header,
    HTTPException,
    Request,
    UploadFile,
)

from app.core.shared.limiter import limiter
from app.core.utils import (
    cleanup_paths,
    create_path,
    make_namespace,
)
from app.schemas.documents import DocumentUploadResponse
from app.services.docs_assistant.ingestion import ingest_pdf

router = APIRouter()
MAX_DOCUMENT_SIZE = 4.5 * 1024 * 1024


@router.post(
    "/documents/upload", status_code=201, response_model=DocumentUploadResponse
)
@limiter.limit("5/minute")
async def upload_document(
    request: Request,
    file: UploadFile,
    background_tasks: BackgroundTasks,
    session_id: str = Header(alias="X-Session-ID"),
):

    file_content = await file.read()
    if len(file_content) > MAX_DOCUMENT_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds {MAX_DOCUMENT_SIZE / (1024 * 1024):.0f} MB limit",
        )
    input_path = ""

    try:
        namespace = make_namespace(session_id)
    except ValueError as error:
        raise HTTPException(status_code=400, detail="Invalid session ID") from error

    try:
        input_path = create_path(file.filename, file_content)
        result = ingest_pdf(input_path, namespace)
        background_tasks.add_task(cleanup_paths, input_path)
        return {
            "message": "File uploaded",
            "namespace": namespace,
            "document_id": result["document_id"],
            "filename": result["filename"],
        }

    except Exception as e:  # noqa: BLE001
        cleanup_paths(input_path)
        print(f"Upload Error:{type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
