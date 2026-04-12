import { checkAdminAndRedirect } from "../login";

export async function editPaymentLinkRoute(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req);
  if (adminRedirect) return adminRedirect;
  //TODO implement
  return Response.json({});
}
