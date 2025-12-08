import { Route } from "react-router-dom";

export default function PublicRoutes() {
  return [<Route key="public" path="/" element={<div>Public</div>} />];
}
