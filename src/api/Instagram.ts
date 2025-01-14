import axios from 'axios';
import FormData from 'form-data';
import * as cheerio from 'cheerio';

const Instagram = (url: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append('url', url);
            const { data } = await axios.post("https://snapinsta.net/download.php", formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });
            const $ = cheerio.load(data.html);
            let link: string[] = [];
            $('a').each((index, element) => {
                const href: string | undefined = $(element).attr('href');
                link.push(href!);
            });
            resolve(link[0]);
        } catch(error) {
            reject(error);
        }
    });
}

export default Instagram;