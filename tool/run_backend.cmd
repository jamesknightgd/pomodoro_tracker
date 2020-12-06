@echo off
pushd "built\backend"
cmd /c "node.exe .\entry.js"
popd
exit 0