import { BaiDoc, metaBai, thamSo } from '@/components/BaiDoc';

export const dynamicParams = false;
export const generateStaticParams = thamSo('kien-thuc', 'bai');
export const generateMetadata = async ({ params }: { params: Promise<{ bai: string }> }) => metaBai('kien-thuc', (await params).bai);
export default async function Trang({ params }: { params: Promise<{ bai: string }> }) {
  return <BaiDoc nhom="kien-thuc" ma={(await params).bai} />;
}
