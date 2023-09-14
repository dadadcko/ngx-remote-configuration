const shell = require('shelljs');

const toCopy = {
  readme: {
    source: './README.md',
    target: './dist/ngx-remote-configuration',
  },
  license: {
    source: './LICENSE',
    target: './dist/ngx-remote-configuration',
  },
};

shell.echo('Start copying files...');

Object.entries(toCopy).forEach(([_, value]) => {
  const { source, target, createDirectoryFirst } = value;

  if (!!createDirectoryFirst) {
    shell.mkdir('-p', `${target}`);
  }

  shell.echo(`Copying from ${source} to ${target}`);
  shell.cp('-r', `${source}`, `${target}`);
});

shell.echo('...DONE');
