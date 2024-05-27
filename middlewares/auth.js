const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { decrypt } = require("../utils/encrypt");
const {
  roleService,
  roleUserModuleAccessService,
  studentService,
} = require("../services");
const { LOGINTYPES } = require("../config/constant");

const verifyCallback =
  (request, resolve, reject) => async (error, data, info) => {
    if (error || info || !data) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    // console.log(data)
    const { type, user } = data;
    if (type == LOGINTYPES.USER) {
      request.user = user;
      const role = await roleService.getById(user.role);
      // return reject(new ApiError(httpStatus.BAD_REQUEST, request.headers));
      // if (!role.isAdmin && 1 == 2) {
      // console.log(request.headers,"headers")
      // console.log(role);
      if (!role.isAdmin && !request.headers.passaccess) {
        if (request.headers.module_id) {
          let module_id;
          try {
            module_id = decrypt(request.headers.module_id);
          } catch {
            return reject(
              new ApiError(httpStatus.BAD_REQUEST, "Invalid Module ID")
            );
          }
          const user_id = decrypt(user.id);
          let data =
            await roleUserModuleAccessService.getModuleByRoleIdUserIdAndModuleId(
              user.role,
              module_id
            );
          if (data && data.hasAccess) {
            return resolve();
          }

          data =
            await roleUserModuleAccessService.getModuleByRoleIdUserIdAndModuleId(
              user_id,
              module_id,
              "userId"
            );
          if (!data) {
            return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
          }
          if (!data.hasAccess) {
            return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
          }
          return resolve();
        }

        return reject(
          new ApiError(httpStatus.BAD_REQUEST, "Module ID is required")
        );
      }
      // check if user is blacklisted
      if (request.user.dataValues.isBlacklisted) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    } else if (type == LOGINTYPES.STUDENT) {
      if (!role.isAdmin && !request.headers.passaccess) {
        if (request.headers.module_id) {
          let module_id;
          try {
            module_id = decrypt(request.headers.module_id);
          } catch {
            return reject(
              new ApiError(httpStatus.BAD_REQUEST, "Invalid Module ID")
            );
          }
          const user_id = decrypt(user.id);
          let data =
            await roleUserModuleAccessService.getModuleByRoleIdUserIdAndModuleId(
              user.role,
              module_id
            );
          if (data && data.hasAccess) {
            return resolve();
          }

          data =
            await roleUserModuleAccessService.getModuleByRoleIdUserIdAndModuleId(
              user_id,
              module_id,
              "userId"
            );
          if (!data) {
            return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
          }
          if (!data.hasAccess) {
            return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
          }
          return resolve();
        }

        return reject(
          new ApiError(httpStatus.BAD_REQUEST, "Module ID is required")
        );
      }
    }
    resolve();
  };

const userAccessChecking = async (user_id, module_id) => {
  const data =
    await roleUserModuleAccessService.getModuleByRoleIdUserIdAndModuleId(
      user_id,
      module_id,
      "userId"
    );
  if (!data || !data.hasAccess) {
    return false;
  }
  return true;
};

const auth =
  (...requiredRights) =>
  async (request, response, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(request, resolve, reject, requiredRights)
      )(request, response, next);
    })
      .then(() => next())
      .catch((error) => next(error));
  };

module.exports = auth;
