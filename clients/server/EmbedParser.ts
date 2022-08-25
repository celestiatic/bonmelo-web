import { TenorClient } from "./TenorClient";
import metascraper from "metascraper";
import metascraperUrl from "metascraper-url";
import metascraperTitle from "metascraper-title";
import metascraperImage from "metascraper-image";
import metascraperDate from "metascraper-date";
import metascraperDescription from "metascraper-description";
import fetch from 'node-fetch'

const metascraperClient = metascraper([
  metascraperUrl(),
  metascraperTitle(),
  metascraperImage(),
  metascraperDate(),
  metascraperDescription(),
]);

interface Handler {
  provider: {
    name: string;
    url: string;
  };
  regex: Array<string>;
  handler: (url: string) => Promise<EmbedResponse|null>;
}
export interface EmbedResponse {
    provider?: {
        name?: string;
        url?: string;
    },
    id: string;
    author?: string;
    title?: string;
    url?: string;
    footer?: string;
    thumbnail?: string;
    description?: string;
    frame?: boolean;
}

export class EmbedParser {
  handlers: Array<Handler> = [
    {
      provider: {
        name: "Tenor",
        url: "https://tenor.co",
      },
      regex: ["(.+)://tenor.com/view/(.+)"],
      async handler(url) {
        const gifId = url.split("-").at(-1);
        const gifResult = await TenorClient.Search.Find([gifId]).then(
          (gifData) => {
            return gifData[0];
          }
        );
        if (!gifResult) {
          return null;
        }

        const gifMedia = gifResult?.media?.[0]?.gif?.url;

        return {
          provider: {
            name: this.provider.name,
            url: this.provider.url,
          },
          id: gifResult?.id,
          thumbnail: gifMedia,
          frame: false,
        };
      },
    },
    {
      provider: {
        name: "Tiktok",
        url: "https://www.tiktok.com",
      },
      regex: ["(.+)://www.tiktok.com/@(.+)", "(.+)://vt.tiktok.com/(.+)"],
      async handler(siteUrl) {
        const { html, url } = await fetch(siteUrl).then(async (res) => {
          return {
            url: res.url,
            html: await res.text(),
          };
        });

        const metadata = await metascraperClient({
          html,
          url,
        });

        return {
          provider: {
            name: this.provider.name,
            url: this.provider.url,
          },
          id: metadata.title,
          author: this.provider.name,
          title: metadata.title,
          description: metadata.description,
          url: url,
          thumbnail: metadata.image,
          frame: true,
        };
      },
    },
    {
      provider: {
        name: "Youtube",
        url: "https://www.youtube.com",
      },
      regex: ["(.+)://www.youtube.com/watch(.+)", "(.+)://youtu.be/(.+)"],
      async handler(siteUrl) {
        console.log('owo')
        const { html, url } = await fetch(siteUrl).then(async (res) => {
          return {
            url: res.url,
            html: await res.text(),
          };
        });

        const metadata = await metascraperClient({
          html,
          url,
        });

        return {
          provider: {
            name: this.provider.name,
            url: this.provider.url,
          },
          id: metadata.title,
          author: this.provider.name,
          title: metadata.title,
          description: metadata.description,
          url: url,
          thumbnail: metadata.image,
          frame: true,
        };
      },
    },
  ];

  constructor() {}

  async extract(messageContent: string): Promise<Array<EmbedResponse>> {
    return new Promise(async (resolve, reject) => {
      let customHandled = false;
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls: Array<string> = [];
      messageContent.replace(urlRegex, (url) => {
        urls.push(url);
        return "";
      });

      const embeds: Array<EmbedResponse> = [];
      for (const url of urls) {
        for (const handlerData of this.handlers) {
          let matched = false;
          for (const handlerRegex of handlerData.regex) {
            const regexMatch = url.match(handlerRegex);
            if (regexMatch) {
              matched = true;
              break;
            }
          }

          if (matched) {
            let resultReturned = false;
            setTimeout(() => {
              if (resultReturned == false) {
                resultReturned = true;
                return resolve(embeds);
              }
            }, 5000);
            const result = await handlerData.handler(url);
            console.log(result);
            // if (result?.thumbnail) {
            //   const imageResponse = await fetch(result?.thumbnail)
            //   const imageFetched = await imageResponse.blob();
            //   console.log(imageFetched);
            //   await supabase.storage
            //     .from("embedimages")
            //     .upload(`${uuid()}_${result?.id}`, imageFetched, {
            //       cacheControl: "3600",
            //       upsert: false,
            //     });
            // }
            if (result && !resultReturned) embeds.push(result);
            resultReturned = true;
            break;
          }
        }
      }
      resolve(embeds);
    });
  }

  registerHandler(handlerData: Handler) {
    this.handlers.push(handlerData);
  }
}
