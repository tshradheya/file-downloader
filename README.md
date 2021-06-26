# File Downloader

This is a simple CLI file downloader supporting multiple protocols to download files to local disk.
It supports the following protocols to download files like SFTP/FTP/HTTP/HTTPS.

- SFTP
- FTP
- HTTP
- HTTPS

## Setup

### Versions

- Node (v12.16)
- NPM (v6.14)

### Installation

- Run `npm install -g .` on the root level of this project
- Run `file-downloader --version` to check if correctly downloaded

## Usage

1. Create input file which has list of urls to download from on each separate line (`input.txt`)

```text
sftp://demo:demo@demo.wftpserver.com:2222/download/Summer.jpg
https://github.com/tshradheya/currency-ranker/releases/tag/v1.0.2
http://github.com/CS2103AUG2017-W14-B1/main/archive/refs/tags/V1.5.1.zip
sftp://demo:demo@demo.wftpserver.com:2222/download/wftpserver-mac-i386.tar.gz
ftp://demo:password@test.rebex.net/pub/example/KeyGeneratorSmall.png
sftp://demo:demo@demo.wftpserver.com:2222/download/manual_en.pdf
```

2. Create output directory (`output/`)
3. Run `file-downloader -i input.txt -o output`

Note: Run `file-downloader --help` for information

## Testing

- Run `npm run test` to run all tests.
- Run `npm run test:watch` to run in watch mode while development

## Tackling challenges

- The CLI supports 4 different protocol and based on the url it deciphers and downloads accordingly.

- For handling scenarios where size of file may be bigger than memory, I have used streaming so that a pipe is kept open and data is streamed in small chunks. This will prevent it from running out of memory.

- Since some files may be big and some small, I have use async functionality of NodeJS for concurrency and it runs 4 downloads currently in parallel while maintaining a queue so that small files dont have to wait for 1 big file

- Proper error handling and fail checks are done to prevent unexpected states. Files are cleaned and deleted if any error occurs.

- Unit, Integration and End-to-End tests are added so that they can catch any breaking changes and ensure code is running as expected.

- Effort has been put in to handle all edge cases and different scenarios.

## Resources

-
- `https://www.wftpserver.com/onlinedemo.htm` was used as mock SFTP server to test code
- `https://test.rebex.net/` was used for FTP server

## Future Development

- More abstraction for concurrency
- Support more protocols
