#!/bin/bash
# Kiểm tra dữ liệu cá nhân trong logs và JSONL

grep -rE "[A-Za-z0-9_-]{16,32}" /home/claude/xemtuvi.vn/logs /home/claude/xemtuvi.vn/src/lib/su-kien.jsonl