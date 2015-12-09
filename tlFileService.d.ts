declare module Triarc.Web {
    interface IDownloadEvents {
        downloading(): any;
        failedOpening(): any;
    }
    class FileService {
        private $q;
        static serviceId: string;
        static $inject: string[];
        constructor($q: angular.IQService);
        downloadFile(url: string, fileName: string, isMobile: boolean, downloadEvents?: IDownloadEvents): angular.IPromise<boolean>;
        private mobileDownload(url, name);
    }
}
