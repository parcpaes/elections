const AccessControl = require('accesscontrol');

const grantList = [
  { role: 'Operador', resource: 'actas', action: 'create:any' },
  { role: 'Operador', resource: 'actas', action: 'read:any' },
  { role: 'Operador', resource: 'actas/image', action: 'update:any' },
  { role: 'Control', resource: 'actas', action: 'read:any' },
  { role: 'Control', resource: 'actas', action: 'update:any' },
  { role: 'Control', resource: 'actas/image', action: 'update:any' },
  { role: 'Operador', resource: 'votacion', action: 'read:any' },
  { role: 'Operador', resource: 'votacion', action: 'create:any' },
  { role: 'Control', resource: 'votacion', action: 'read:any' },
  { role: 'Control', resource: 'votacion', action: 'update:any' },
  { role: 'Operador', resource: 'recintos', action: 'read:any' },
  { role: 'Operador', resource: 'recintos/id/mesa', action: 'update:any' },
  { role: 'Control', resource: 'recintos', action: 'read:any' },
];

const accessRoles = new AccessControl(grantList);
accessRoles.grant('Telecentro').extend(['Operador', 'Control']);
accessRoles
  .grant('Admin')
  .extend(['Operador', 'Control'])
  .resource([
    'users',
    'departamentos',
    'circunscripcions',
    'provincias',
    'municipios',
    'localidades',
    'recintos',
  ])
  .createAny()
  .readAny()
  .updateAny()
  .deleteAny();

module.exports = { accessRoles };
