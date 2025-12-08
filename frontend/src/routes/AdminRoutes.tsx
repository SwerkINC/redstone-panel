import { Admin } from "@/pages/Admin";
import { Route } from "react-router-dom";

export default function AdminRoutes() {
  return [<Route key="admin" path="/admin" element={<Admin />} />];
}
