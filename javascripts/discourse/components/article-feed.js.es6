// convert minutes added in component settings to milliseconds
const TIMEOUT = settings.cache_timeout * 60 * 1000;

const ajaxUrl = `${settings.article_source}/wp-json/wp/v2/${settings.filter}&_embed`;

export default Ember.Component.extend({
  classNames: "article-feed-component",

  init() {
    this._super(...arguments);

    if (!this.site._articleFeed) {
      this.site._articleFeed = [];
    }

    $.ajax({
      url: ajaxUrl,
      beforeSend: () => {
        if (this.site._articleFeed.length) {
          this.pushFeed(this.site._articleFeed[0]);

          return false;
        }
        return true;
      },
      complete: result => {
        this.site._articleFeed.push(result.responseJSON);
        this.pushFeed(result.responseJSON);
      }
    });
  },

  pushFeed(feed) {
    const articles = [];

    let i;
    for (i = 0; i < feed.length; ++i) {
      const article = [];

      const feedItem = feed[i];

      const media = feedItem._embedded["wp:featuredmedia"].firstObject;

      article.title = feedItem.title.rendered ? feedItem.title.rendered : false;

      article.thumbnail = media.source_url
        ? media.source_url + settings.thumbnail_size
        : false;

      article.thumbnailTitle = media.title ? media.title.rendered : false;

      article.link = feedItem.link ? feedItem.link : false;

      if (
        article.link &&
        article.thumbnailTitle &&
        article.thumbnail &&
        article.title
      ) {
        articles.push(article);
      }
    }

    this.set("args", { articles: articles });

    Ember.run.schedule("afterRender", this, () => {
      this.carousel();
    });

    Ember.run.later(() => this.refreshCache(), TIMEOUT);
  },

  carousel() {
    $(".owl-carousel").owlCarousel({
      loop: true,
      stagePadding: 50,
      margin: 10,
      dots: false,
      navContainer: ".feed-nav-wrapper",
      responsiveClass: true,
      responsive: {
        0: {
          items: 1,
          nav: false
        },
        500: {
          items: 2,
          nav: false
        },
        750: {
          items: 3,
          nav: true
        },
        1100: {
          items: 4,
          nav: true
        }
      }
    });
  },

  refreshCache() {
    this.set("args", "");
    this.site._articleFeed = "";
  }
});
