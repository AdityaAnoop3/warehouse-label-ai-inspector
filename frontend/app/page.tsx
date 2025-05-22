// frontend/app/page.tsx
import ImageUpload from "../components/ImageUpload";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">
        Warehouse Symbol Detection
      </h1>
      <ImageUpload />
    </main>
  );
}