import axios from "axios";
import FormData from "form-data";
import * as cheerio from "cheerio";


const Facebook = (url: string) => {
    return new Promise( async (resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append("k-token", "3b349973cbf53ac4105d9377d6f8978b5f1b4bdf9768f4285caaafecabf368c0");
            formData.append("q", url);
            formData.append("web", "fdownloader.net");
            formData.append("v", "v2");
            const { data } = await axios.post("https://v3.fdownloader.net/api/ajaxSearch", formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });

            if(data?.mess?.include("Error")) throw new Error("Error: Video diprivasi");

            const $ = cheerio.load(data.data);
            let link: string[] = [];
            $('a').each((index, element) => {
                const href: string | undefined = $(element).attr('href');
                link.push(href!);
            });
            resolve(link[1]);
        } catch(error) {
            reject(error);
        };
    })
};

export default Facebook;