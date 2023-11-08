const express = require('express');
const Permission = require('../models/permision.model');
const jwt = require('jsonwebtoken');
const { session } = require('passport');

const router = express.Router();


const checkPermission = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization;
    console.log(token);
  
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
  
    try {
      console.log("1");
      const tokenb = token.replace('Bearer ', '');
      console.log("2");
      const decoded = jwt.verify(tokenb, 'your-secret-key');
      const userRole = decoded.role; 
      console.log(req.body,decoded);
  
      // if (userRole === 'admin') {
      //   return next();
      // }
      const resourcePath = req.body.url;
      console.log("route path",resourcePath);
  
      const resourcePermissions = await Permission.findOne({ page: resourcePath });
      console.log("hi");
      console.log(resourcePermissions,resourcePermissions[userRole],userRole,"jdcnjndcsdj");
      console.log("hi");
  
      if (!resourcePermissions) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      if (userRole && resourcePermissions[userRole]) {
        next();
      } else {
        res.status(403).json({ message: 'Access denied' });
      }
    } catch (error) {
      console.log("ent");
      res.status(401).json({ message: 'Invalid token' });
    }
  };
  
router.post('/page', checkPermission, (req, res) => {
  res.status(200).json({ message: 'Access granted' });
  console.log("entered");
});

router.get('/settings/system', async (req, res) => {
  try {
    console.log('setting - userId:', 'sessionID:', req.sessionID,req.session);
console.log(req.session);
    const permissions = await Permission.find({}).exec();
    const permissionsMap = {};
    permissions.forEach((permission) => {
      permissionsMap[permission.page] = {
        admin: permission.admin,
        moderator: permission.moderator,
        trainer: permission.trainer,
      };
    });
    res.status(200).json(permissionsMap);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Failed to retrieve permissions' });
  }
});

router.post('/settings/system', async (req, res) => {
  try {
    const { permissions } = req.body;

    const permissionUpdates = Object.keys(permissions).map((page) => ({
      updateOne: {
        filter: { page },
        update: {
          admin: permissions[page].admin,
          moderator: permissions[page].moderator,
          trainer: permissions[page].trainer,
        },
      },
    }));

    await Permission.bulkWrite(permissionUpdates);

    res.status(200).json({ message: 'Permissions updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update permissions' });
  }
});

router.post('/pages', async (req, res) => {
  const { page, admin, moderator, trainer } = req.body;
  console.log(req.session.id);

  try {
    let existingPermission = await Permission.findOne({ page });

    if (existingPermission) {
      res.status(400).json({ error: 'Page already exists' });
    } else {
      const newPermission = new Permission({
        page,
        admin,
        moderator,
        trainer,
      });
      await newPermission.save();
      res.status(201).json({ message: 'Page and permissions added successfully' });
    }
  } catch (error) {
    console.error('Error adding page and permissions:', error);
    res.status(500).json({ error: 'Failed to add page and permissions' });
  }
});

router.get('/api/permissions', async (req, res) => {
  const token = req.cookies.token || req.headers.authorization;
  console.log(token,"dfgbhxgtdfsesdrfgdrsesrdrssd");

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    console.error("permision of sidebar");

    console.log("1");
    const tokenb = token.replace('Bearer ', '');
    console.log("2");
    const decoded = jwt.verify(tokenb, 'your-secret-key');
    const role = decoded.role; 
    console.log(req.body,decoded);

    const permissions = await Permission.find({ [role]: true });

    const allowedPages = permissions.map(permission => permission.page);
console.log(permissions,allowedPages);

    res.json(allowedPages);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
