import importlib.util
from pathlib import Path

from alembic.migration import MigrationContext
from alembic.operations import Operations
from sqlalchemy import (
    Column,
    Float,
    Integer,
    MetaData,
    String,
    Table,
    create_engine,
    inspect,
)

migration_path = (
    Path(__file__).parents[2]
    / "alembic"
    / "versions"
    / "ae4c1f31b7d2_add_structured_receipt_fields.py"
)
migration_spec = importlib.util.spec_from_file_location(
    "structured_receipt_fields", migration_path
)
assert migration_spec and migration_spec.loader
migration = importlib.util.module_from_spec(migration_spec)
migration_spec.loader.exec_module(migration)


def test_structured_receipt_migration_preserves_existing_records(monkeypatch):
    engine = create_engine("sqlite://")
    metadata = MetaData()
    receipts = Table(
        "receipts",
        metadata,
        Column("id", Integer, primary_key=True),
        Column("filename", String, nullable=False),
        Column("total_detections", Integer, nullable=False),
        Column("detections", String, nullable=False),
        Column("confidence_threshold", Float, nullable=False),
    )
    metadata.create_all(engine)

    with engine.begin() as connection:
        connection.execute(
            receipts.insert().values(
                filename="existing.jpg",
                total_detections=1,
                detections="[]",
                confidence_threshold=0.5,
            )
        )
        operations = Operations(MigrationContext.configure(connection))
        monkeypatch.setattr(migration, "op", operations)
        migration.upgrade()

        columns = {
            column["name"] for column in inspect(connection).get_columns("receipts")
        }
        record = connection.execute(receipts.select()).one()

    assert {
        "merchant",
        "receipt_date",
        "line_items",
        "subtotal",
        "tax",
        "total",
        "currency",
    } <= columns
    assert record.filename == "existing.jpg"
    assert record.total_detections == 1
