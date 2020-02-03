run:
	jpm --addon-dir src run -b /usr/bin/palemoon

xpi:
	mkdir -p build
	jpm --addon-dir src --dest-dir build xpi

clean:
	rm -rf build
