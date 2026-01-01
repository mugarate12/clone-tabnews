import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "infra/model/user";

const router = createRouter();

router.post(postHandler);
export default router.handler(controller.errorsHandlers);

async function postHandler(request, response) {
  const userCreated = await user.create(request.body);
  return response.status(201).json(userCreated);
}
