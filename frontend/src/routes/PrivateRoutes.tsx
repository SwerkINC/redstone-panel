import { Route } from "react-router-dom";

export default function PrivateRoutes() {
  return [<Route key="private" path="/" element={<div>Private</div>} />];
}
