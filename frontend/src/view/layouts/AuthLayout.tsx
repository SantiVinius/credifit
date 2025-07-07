import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-6 py-8">
        <div className="text-center mb-8">
          <h6 className="text-2xl font-bold text-gray-900">CrediFit</h6>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
