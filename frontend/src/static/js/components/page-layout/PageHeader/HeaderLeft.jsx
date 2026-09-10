import React from 'react';
import { PageStore } from '../../../utils/stores/';
import { LinksConsumer } from '../../../utils/contexts/';
import { useLayout, useUser } from '../../../utils/hooks/';
import { CircleIconButton } from '../../_shared';

export function HeaderLeft() {
  const { enabledSidebar, toggleMobileSearch, toggleSidebar } = useLayout();
  const { isAnonymous } = useUser();

  return (
    <LinksConsumer>
      {(links) => (
        <div className="page-header-left bp-header-left">
          <div>
            <div className="close-search-field">
              <CircleIconButton onClick={toggleMobileSearch}>
                <i className="material-icons">arrow_back</i>
              </CircleIconButton>
            </div>

            {enabledSidebar ? (
              <div className="toggle-sidebar bp-mobile-menu-toggle">
                <CircleIconButton onClick={toggleSidebar}>
                  <i className="material-icons">menu</i>
                </CircleIconButton>
              </div>
            ) : null}

            <a className="bp-wordmark" href={links.home} aria-label="Blue Penny home">
              <span className="bp-wordmark-coin">BP</span>
              <span className="bp-wordmark-text">BLUE PENNY</span>
            </a>

            {!isAnonymous ? (
              <nav className="bp-top-nav" aria-label="Main navigation">
                <a href={links.home}>Home</a>
                <a href={links.featured}>Originals</a>
                <a href={links.archive.categories}>Shows</a>
                <a href={links.latest}>New Episodes</a>
                <a href={links.user.liked}>My List</a>
              </nav>
            ) : null}

            {PageStore.get('config-contents').header.onLogoRight ? (
              <div
                className="on-logo-right"
                dangerouslySetInnerHTML={{ __html: PageStore.get('config-contents').header.onLogoRight }}
              ></div>
            ) : null}
          </div>
        </div>
      )}
    </LinksConsumer>
  );
}
