from django.db import migrations


def set_team_ids(apps, schema_editor):
    """Copy MongoDB _id into the document `id` field for Team records where
    `id` is missing so Django's ORM has a usable PK for every Team.

    This is defensive and idempotent: it only sets `id` when it's missing or
    null and leaves existing values untouched.
    """
    try:
        from django.conf import settings
        from pymongo import MongoClient
    except Exception:
        # If pymongo isn't available, abort silently (migration will not fail
        # in test environments without pymongo).
        return

    db_cfg = settings.DATABASES['default']
    db_name = db_cfg.get('NAME')
    client_host = db_cfg.get('CLIENT', {}).get('host', 'localhost')
    client_port = db_cfg.get('CLIENT', {}).get('port', 27017)

    client = MongoClient(client_host, client_port)
    coll = client[db_name]['octofit_tracker_team']

    for doc in coll.find():
        # if `id` is not present or is falsy, set it to the existing _id value
        if not doc.get('id'):
            coll.update_one({'_id': doc['_id']}, {'$set': {'id': doc['_id']}})


def unset_team_ids(apps, schema_editor):
    """Reverse of set_team_ids: remove `id` fields that equal `_id` so the
    migration can be reversed safely.
    """
    try:
        from django.conf import settings
        from pymongo import MongoClient
    except Exception:
        return

    db_cfg = settings.DATABASES['default']
    db_name = db_cfg.get('NAME')
    client_host = db_cfg.get('CLIENT', {}).get('host', 'localhost')
    client_port = db_cfg.get('CLIENT', {}).get('port', 27017)

    client = MongoClient(client_host, client_port)
    coll = client[db_name]['octofit_tracker_team']

    for doc in coll.find({'id': {'$exists': True}}):
        if doc.get('id') == doc.get('_id'):
            coll.update_one({'_id': doc['_id']}, {'$unset': {'id': ''}})


class Migration(migrations.Migration):

    dependencies = [
        ('octofit_tracker', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(set_team_ids, reverse_code=unset_team_ids),
    ]
