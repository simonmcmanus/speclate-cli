# speclate-cli

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

# --validate

Validate a schema against the speclate schema

https://github.com/simonmcmanus/speclate-schema


# --all
Generate all the files needed to host a site.


# --specs

Generate spec files.

# --debug

```bash
speclate --debug 8080
```

Runs a development server, you need to specify the port you want the server to run on.



# --files

Move the files listed in the spec.js file into the outputDir.

# --watch

Watches the files listed in the spec and moves them into the docs directory when they change.




# --appcache


Generate the appcache manifest files

# --markup

Generate just the HTML pages defined in the spec.
