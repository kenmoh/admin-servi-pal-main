const fs = require('fs');
const { execSync } = require('child_process');

const components = [
  'button',
  'card',
  'input',
  'label',
  'select',
  'table',
  'sidebar',
  'calendar',
  'dialog',
  'dropdown-menu',
  'popover',
  'toast',
  'tooltip',
];

const installComponent = (component) => {
  try {
    console.log(`Installing ${component}...`);
    execSync(`npx shadcn-ui@latest add ${component}`, { stdio: 'inherit' });
    console.log(`Successfully installed ${component}`);
  } catch (error) {
    console.error(`Failed to install ${component}:`, error);
  }
};

components.forEach(installComponent);
