// const roles = new Set(['Admin', 'Operador', 'Control', 'Reportes']);
const { accessRoles } = require('../accesscontrol/listRoles');
module.exports = function validRol(action, resource) {
  // 401 Unauthorized
  // 403 forbidden
  // admin
  // operador (votaciones(post),acta(post),trabajodores(post)).
  // control: (votaction, acta)verificar(put)
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.rol) return res.status(403).json({ error: 'No tienes acceso' });
      const permission = accessRoles.can(req.user.rol)[action](resource);
      if (!permission){
        console.log(req.user.rol);
        if(req.user.rol==='Admin'){
          next(); 
        }
        return res.status(403).json({ error: 'No tienes acceso' });
      }
      next();//
    } catch (error) {
      console.log(error);
      next();
    }
  };
};
