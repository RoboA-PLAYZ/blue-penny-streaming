import React, { useState } from 'react';
import { ApiUrlConsumer, LinksConsumer } from '../utils/contexts/';
import { PageStore } from '../utils/stores/';
import { MediaListRow } from '../components/MediaListRow';
import { MediaMultiListWrapper } from '../components/MediaMultiListWrapper';
import { InlineSliderItemListAsync } from '../components/item-list/InlineSliderItemListAsync.jsx';
import { Page } from './Page';

const EmptyMedia: React.FC = () => {
  return (
    <div className="bp-empty-library">
      <div className="bp-empty-coin">BP</div>
      <h2>Blue Penny is getting ready.</h2>
      <p>Our shows, specials, and new episodes will appear here as soon as they are released.</p>
    </div>
  );
};

interface HomePageProps {
  id?: string;
  latest_title: string;
  featured_title: string;
  recommended_title: string;
  latest_view_all_link: boolean;
  featured_view_all_link: boolean;
  recommended_view_all_link: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  id = 'home',
  featured_title = 'Blue Penny Originals',
  recommended_title = 'More for You',
  latest_title = 'New Episodes',
  latest_view_all_link = true,
  featured_view_all_link = true,
  recommended_view_all_link = true,
}) => {
  const [zeroMedia, setZeroMedia] = useState(false);
  const [visibleLatest, setVisibleLatest] = useState(false);
  const [visibleFeatured, setVisibleFeatured] = useState(false);
  const [visibleRecommended, setVisibleRecommended] = useState(false);
  const [visibleHistory, setVisibleHistory] = useState(false);
  const [visibleLiked, setVisibleLiked] = useState(false);

  const onLoadLatest = (length: number) => {
    setVisibleLatest(0 < length);
    setZeroMedia(0 === length);
  };

  const onLoadFeatured = (length: number) => {
    setVisibleFeatured(0 < length);
  };

  const onLoadRecommended = (length: number) => {
    setVisibleRecommended(0 < length);
  };

  const onLoadHistory = (length: number) => {
    setVisibleHistory(0 < length);
  };

  const onLoadLiked = (length: number) => {
    setVisibleLiked(0 < length);
  };

  const hideViews = !PageStore.get('config-media-item').displayViews;
  const hideAuthor = true;
  const hideDate = true;

  return (
    <Page id={id}>
      <LinksConsumer>
        {(links) => (
          <ApiUrlConsumer>
            {(apiUrl) => (
              <div className="bp-streaming-home">
                <section className="bp-cinematic-hero" aria-labelledby="bp-home-title">
                  <div className="bp-hero-copy">
                    <div className="bp-hero-eyebrow">
                      <span className="bp-hero-coin">BP</span>
                      <span>Blue Penny Originals</span>
                    </div>
                    <h1 id="bp-home-title">Our shows. Our stories. One place.</h1>
                    <p>Watch Blue Penny series, premieres, shorts, specials, and every new episode from the studio.</p>
                    <div className="bp-hero-actions">
                      <a className="bp-watch-button" href={links.featured}>
                        <i className="material-icons" aria-hidden="true">play_arrow</i>
                        <span>Watch Featured</span>
                      </a>
                      <a className="bp-browse-button" href={links.latest}>
                        <span>Browse Episodes</span>
                      </a>
                    </div>
                  </div>
                  <div className="bp-hero-art" aria-hidden="true">
                    <div className="bp-hero-orbit bp-orbit-one"></div>
                    <div className="bp-hero-orbit bp-orbit-two"></div>
                    <div className="bp-hero-penny">BP</div>
                    <div className="bp-hero-card bp-hero-card-one">ORIGINALS</div>
                    <div className="bp-hero-card bp-hero-card-two">NEW EPISODES</div>
                  </div>
                  <div className="bp-hero-fade"></div>
                </section>

                <MediaMultiListWrapper className="items-list-ver bp-streaming-shelves">
                  <MediaListRow
                    className="bp-shelf bp-shelf-history"
                    title="Continue Watching"
                    style={!visibleHistory ? { display: 'none' } : undefined}
                    viewAllLink={links.user.history}
                  >
                    <InlineSliderItemListAsync
                      requestUrl={apiUrl.user.history}
                      itemsCountCallback={onLoadHistory}
                      hideViews={hideViews}
                      hideAuthor={hideAuthor}
                      hideDate={hideDate}
                    />
                  </MediaListRow>

                  {PageStore.get('config-enabled').pages.featured &&
                    PageStore.get('config-enabled').pages.featured.enabled && (
                      <MediaListRow
                        className="bp-shelf bp-shelf-featured"
                        title={featured_title}
                        style={!visibleFeatured ? { display: 'none' } : undefined}
                        viewAllLink={featured_view_all_link ? links.featured : null}
                      >
                        <InlineSliderItemListAsync
                          requestUrl={apiUrl.featured}
                          itemsCountCallback={onLoadFeatured}
                          hideViews={hideViews}
                          hideAuthor={hideAuthor}
                          hideDate={hideDate}
                        />
                      </MediaListRow>
                    )}

                  <MediaListRow
                    className="bp-shelf bp-shelf-latest"
                    title={latest_title}
                    style={!visibleLatest ? { display: 'none' } : undefined}
                    viewAllLink={latest_view_all_link ? links.latest : null}
                  >
                    <InlineSliderItemListAsync
                      requestUrl={apiUrl.media}
                      itemsCountCallback={onLoadLatest}
                      hideViews={hideViews}
                      hideAuthor={hideAuthor}
                      hideDate={hideDate}
                      pageItems={16}
                    />
                  </MediaListRow>

                  {PageStore.get('config-enabled').pages.recommended &&
                    PageStore.get('config-enabled').pages.recommended.enabled && (
                      <MediaListRow
                        className="bp-shelf bp-shelf-recommended"
                        title={recommended_title}
                        style={!visibleRecommended ? { display: 'none' } : undefined}
                        viewAllLink={recommended_view_all_link ? links.recommended : null}
                      >
                        <InlineSliderItemListAsync
                          requestUrl={apiUrl.recommended}
                          itemsCountCallback={onLoadRecommended}
                          hideViews={hideViews}
                          hideAuthor={hideAuthor}
                          hideDate={hideDate}
                        />
                      </MediaListRow>
                    )}

                  <MediaListRow
                    className="bp-shelf bp-shelf-list"
                    title="My List"
                    style={!visibleLiked ? { display: 'none' } : undefined}
                    viewAllLink={links.user.liked}
                  >
                    <InlineSliderItemListAsync
                      requestUrl={apiUrl.user.liked}
                      itemsCountCallback={onLoadLiked}
                      hideViews={hideViews}
                      hideAuthor={hideAuthor}
                      hideDate={hideDate}
                    />
                  </MediaListRow>

                  {zeroMedia && <EmptyMedia />}
                </MediaMultiListWrapper>
              </div>
            )}
          </ApiUrlConsumer>
        )}
      </LinksConsumer>
    </Page>
  );
};
