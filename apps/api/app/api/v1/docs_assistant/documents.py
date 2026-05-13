import os
import shutil

from app.core.shared.limiter import limiter
from app.services.docs_assistant.ingestion import ingest_pdf
from fastapi import APIRouter, HTTPException, Request, UploadFile

router = APIRouter()


@router.post("/documents", status_code=201)
@limiter.limit("5/minute")
async def documents(request: Request, file: UploadFile):

    try:
        client_ip = request.client.host
        namespace = f"ip-{client_ip.replace('.', '-').replace(':', '-')}"

        path = f"{file.filename}"
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        ingest_pdf(path, namespace)
        os.remove(path)

        return {"message": "File uploaded", "namespace": namespace}
    except Exception as e:
        if os.path.exists(path):
            os.remove(path)
        raise HTTPException(status_code=500, detail=str(e))
