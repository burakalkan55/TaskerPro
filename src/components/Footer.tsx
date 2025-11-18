export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white mt-20">
      <div className="max-w-7xl mx-auto text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} TaskerPro — All rights reserved.
      </div>
    </footer>
  );
}
