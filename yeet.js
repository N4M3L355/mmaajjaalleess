const { spawn } = require("child_process");

const fs = require('fs').promises;
const fsx = require('fs')
const rawtherapee = require('rawtherapee')


module.exports= async () => {

    let seed = Math.floor(Math.random()*(2**24));
    console.log(seed);
    const ls = spawn("gphoto2", ["--capture-image-and-download","--stdout"]);
    let promise = new Promise(async (resolve, reject) => {

        image = []
        ls.stdout.on("data", data => {
            console.log(data);

            image = image.concat(data)
        });

        ls.stderr.on("data", data => {
            console.log(data);
        });

        ls.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });

        const onChange = (state) => {
            switch (state.status) {
                case 'complete':
                    console.log(state.file, 'process done.')
                    break
                case 'skipped':
                    console.log(state.file, 'have been ignored.')
                    break
                default:
                    console.log('Event', state.status, 'fired.', state)
            }
        }
        output = `output/image${seed}.jpg`

        ls.on("close", async code => {
            var stdoutContent = Buffer.concat(image)
            console.log(`child process exited with code ${code}, ${stdoutContent.length}`);
            await fs.writeFile(`output/image${seed}.rw2`, image);
            await rawtherapee([
                `output/image${seed}.rw2`,
            ], {
                onChange,
                output,
                format: 'jpg',
                compression: 85,
                presets: ['Classic_Chrome.pp3']
            })
              .then((files) => {
                  console.log(files.length, 'files processed.')
                  resolve(output)
              });

        });
    });
    return promise;
}