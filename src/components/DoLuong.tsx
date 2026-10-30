'use client';
import { useEffect } from 'react';
import { ghiVaoTrang } from '@/lib/phien';

/** Không vẽ gì; ghi vao_trang một lần ở trang đầu của phiên. */
export default function DoLuong() {
  useEffect(() => { ghiVaoTrang(); }, []);
  return null;
}
