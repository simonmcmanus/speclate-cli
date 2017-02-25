# speclate-cli

[![Greenkeeper badge](https://badges.greenkeeper.io/simonmcmanus/speclate-cli.svg)](https://greenkeeper.io/)

This package contains the CLI parts of speclate. Its distributed as part of speclate and available using the speclate command:


#Install

This cli is distributed with speclate. To use it just install speclate.

```bash
npm install -g speclate
```


To check you have installed speclate correctly type:

```bash
speclate --validate
```


To get help at any point you can type:

```bash
speclate --help
```

# Commands:


# --build

Generate all the files needed for a site.


# --dev

```bash
speclate --debug 8080
```

Runs a development server, you need to specify the port you want the server to run on.


# --watch

Watches the files listed in the spec and moves them into the docs directory when they change.

