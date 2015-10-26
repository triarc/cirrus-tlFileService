var Triarc;
(function (Triarc) {
    var Web;
    (function (Web) {
        var FileService = (function () {
            function FileService($q) {
                this.$q = $q;
            }
            FileService.prototype.downloadFile = function (url, fileName, isMobile, downloadEvents) {
                var _this = this;
                if (!isMobile) {
                    var link = document.createElement("a");
                    link.href = url;
                    link.target = "_self";
                    link.click();
                    return this.$q.when(true);
                }
                else {
                    if (!angular.isObject(downloadEvents)) {
                        downloadEvents = {
                            downloading: angular.noop,
                            failedOpening: angular.noop
                        };
                    }
                    downloadEvents.downloading();
                    return this.mobileDownload(url, fileName).then(function (file) {
                        var q = _this.$q.defer();
                        window.cordova.plugins.FileOpener.openFile(file.nativeURL, function () {
                            q.resolve(true);
                        }, function (err) {
                            console.log(err);
                            downloadEvents.failedOpening();
                            q.reject(err);
                        });
                        return q.promise;
                    });
                }
            };
            FileService.prototype.mobileDownload = function (url, name) {
                var q = this.$q.defer();
                window.resolveLocalFileSystemURI(window.cordova.file.externalApplicationStorageDirectory, function (entry) {
                    entry.getFile(name, { create: true }, function (fileEntry) {
                        var transfer = new FileTransfer();
                        var target = window.cordova.file.externalApplicationStorageDirectory + name;
                        transfer.download(encodeURI(url), target, function (file) {
                            q.resolve(file);
                        }, function (error) {
                            q.reject();
                        });
                    }, function (error) {
                        q.reject();
                    });
                }, function (error) {
                    q.reject();
                });
                return q.promise;
            };
            FileService.serviceId = "tlFileService";
            FileService.$inject = ["$q"];
            return FileService;
        })();
        Web.FileService = FileService;
        angular.module("tlFileService", []).service(FileService.serviceId, FileService);
    })(Web = Triarc.Web || (Triarc.Web = {}));
})(Triarc || (Triarc = {}));

