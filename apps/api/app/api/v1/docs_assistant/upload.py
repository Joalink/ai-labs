from app.core.shared.limiter import limiter
from app.core.utils import (
    clean_filename,
    cleanup_paths,
    create_path,
    get_client_ip,
    make_namespace,
)
from app.services.docs_assistant.ingestion import ingest_pdf
from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, UploadFile

router = APIRouter()


@router.post("/upload", status_code=201)
@limiter.limit("5/minute")
async def upload_document(
    request: Request, file: UploadFile, background_tasks: BackgroundTasks
):

    file_content = await file.read()

    safe_filename = clean_filename(file.filename)
    input_path = f"data/{safe_filename}"

    try:
        client_ip = get_client_ip(request)
        namespace = make_namespace(client_ip)

        create_path(input_path, file_content)

        ingest_pdf(input_path, namespace)

        background_tasks.add_task(cleanup_paths, input_path)

        return {"message": "File uploaded", "namespace": namespace}

    except Exception as e:
        cleanup_paths(input_path)
        raise HTTPException(status_code=500, detail=str(e))
