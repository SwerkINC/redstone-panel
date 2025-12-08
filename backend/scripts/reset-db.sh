#!/bin/bash
export PATH="./node_modules/.bin:$PATH"

pnpx prisma db push --force-reset && pnpx prisma db seed