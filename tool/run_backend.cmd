@echo off
pushd "built\backend"
cmd /c "node.exe --trace-warnings .\entry.js"
popd
exit 0