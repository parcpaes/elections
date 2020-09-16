
const roles = new Set(['Admin','Operador','Control','Reportes']);
module.exports = function(req, res, next){
    //401 Unauthorized
    //403 forbidden
    //admin
    //operador (votaciones(post),acta(post),trabajodores(post)).
    //control: (votaction, acta)verificar(put)
    console.log(req.user);
    if(!roles.has(req.user.rol)) return res.status(403).send('Access Denied');
    next();
}