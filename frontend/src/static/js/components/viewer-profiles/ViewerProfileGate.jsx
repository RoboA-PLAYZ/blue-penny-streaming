import React, { useEffect, useMemo, useState } from 'react';
import './ViewerProfileGate.scss';

const profileStyles = ['ocean', 'copper', 'violet', 'mint', 'sunset', 'rose', 'slate'];

function storageGet(storage, key) {
  try {
    return storage.getItem(key);
  } catch (error) {
    return null;
  }
}

function storageSet(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch (error) {
    return;
  }
}

function storageRemove(storage, key) {
  try {
    storage.removeItem(key);
  } catch (error) {
    return;
  }
}

function makeProfile(name, style, id) {
  return {
    id: id || String(Date.now()) + '-' + Math.random().toString(36).slice(2, 8),
    name,
    style,
  };
}

function readProfiles(key, displayName) {
  const raw = storageGet(window.localStorage, key);

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.filter((profile) => profile && profile.id && profile.name).slice(0, 7);
      }
    } catch (error) {
      storageRemove(window.localStorage, key);
    }
  }

  return [makeProfile(displayName, 'ocean', 'main')];
}

function ProfileAvatar({ profile, large = false }) {
  const initial = profile.name.trim().charAt(0).toUpperCase() || 'B';

  return (
    <span className={'bp-viewer-avatar bp-viewer-avatar-' + profile.style + (large ? ' is-large' : '')} aria-hidden="true">
      <span>{initial}</span>
      <span className="bp-viewer-avatar-shine"></span>
    </span>
  );
}

export function ViewerProfileGate({ children }) {
  const mediaUser = window.MediaCMS && window.MediaCMS.user ? window.MediaCMS.user : null;
  const username = mediaUser && mediaUser.username ? mediaUser.username : null;
  const isAnonymous = !mediaUser || !mediaUser.is || mediaUser.is.anonymous;
  const displayName = mediaUser && mediaUser.name ? mediaUser.name : username || 'Main';
  const profileKey = username ? 'bluePenny.profiles.' + username : null;
  const activeKey = username ? 'bluePenny.activeProfile.' + username : null;
  const forceChoose = useMemo(() => new URLSearchParams(window.location.search).get('switchProfile') === '1', []);
  const [profiles, setProfiles] = useState(() => (profileKey ? readProfiles(profileKey, displayName) : []));
  const [activeId, setActiveId] = useState(() => {
    if (!activeKey || forceChoose) {
      return null;
    }
    return storageGet(window.sessionStorage, activeKey);
  });
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStyle, setNewStyle] = useState('copper');
  const [error, setError] = useState('');

  const activeProfile = profiles.find((profile) => profile.id === activeId);
  const choosing = !isAnonymous && username && !activeProfile;

  useEffect(() => {
    if (!profileKey || !profiles.length) {
      return;
    }
    storageSet(window.localStorage, profileKey, JSON.stringify(profiles));
  }, [profileKey, profiles]);

  useEffect(() => {
    if (forceChoose && activeKey) {
      storageRemove(window.sessionStorage, activeKey);
      setActiveId(null);
      const url = new URL(window.location.href);
      url.searchParams.delete('switchProfile');
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }
  }, [activeKey, forceChoose]);

  useEffect(() => {
    if (choosing) {
      document.body.classList.add('bp-profile-selecting');
    } else {
      document.body.classList.remove('bp-profile-selecting');
    }

    return () => document.body.classList.remove('bp-profile-selecting');
  }, [choosing]);

  if (!choosing) {
    return children;
  }

  const selectProfile = (profile) => {
    storageSet(window.sessionStorage, activeKey, profile.id);
    setActiveId(profile.id);
    window.dispatchEvent(new CustomEvent('bluepenny:profile-selected', { detail: profile }));
  };

  const addProfile = (event) => {
    event.preventDefault();
    const name = newName.trim();

    if (!name) {
      setError('Enter a profile name.');
      return;
    }

    if (name.length > 24) {
      setError('Profile names can be up to 24 characters.');
      return;
    }

    if (profiles.length >= 7) {
      setError('This account already has the maximum number of profiles.');
      return;
    }

    const nextProfile = makeProfile(name, newStyle);
    setProfiles([...profiles, nextProfile]);
    setNewName('');
    setNewStyle(profileStyles[(profiles.length + 1) % profileStyles.length]);
    setError('');
    setAdding(false);
  };

  return (
    <div className="bp-profile-gate">
      <div className="bp-profile-backdrop"></div>
      <main className="bp-profile-stage" aria-labelledby="bp-profile-title">
        <a className="bp-profile-brand" href="/" aria-label="Blue Penny home">
          <span className="bp-profile-coin">BP</span>
          <span>Blue Penny</span>
        </a>

        <div className="bp-profile-heading">
          <span className="bp-profile-kicker">Blue Penny Streaming</span>
          <h1 id="bp-profile-title">Choose a profile</h1>
          <p>Pick who is watching before entering Blue Penny.</p>
        </div>

        <div className="bp-profile-grid" role="list">
          {profiles.map((profile) => (
            <button className="bp-profile-card" type="button" onClick={() => selectProfile(profile)} key={profile.id} role="listitem">
              <ProfileAvatar profile={profile} large={true} />
              <span className="bp-profile-name">{profile.name}</span>
            </button>
          ))}

          {profiles.length < 7 ? (
            <button className="bp-profile-card bp-profile-add" type="button" onClick={() => setAdding(true)} role="listitem">
              <span className="bp-profile-add-icon" aria-hidden="true">+</span>
              <span className="bp-profile-name">Add Profile</span>
            </button>
          ) : null}
        </div>

        {adding ? (
          <div className="bp-profile-editor" role="dialog" aria-modal="true" aria-labelledby="bp-add-profile-title">
            <form onSubmit={addProfile}>
              <div className="bp-profile-editor-copy">
                <span className="bp-profile-kicker">New viewer</span>
                <h2 id="bp-add-profile-title">Add a profile</h2>
              </div>

              <div className="bp-profile-editor-preview">
                <ProfileAvatar profile={{ name: newName || 'New', style: newStyle }} large={true} />
              </div>

              <label htmlFor="bp-profile-name">Profile name</label>
              <input
                id="bp-profile-name"
                type="text"
                value={newName}
                onChange={(event) => {
                  setNewName(event.target.value);
                  setError('');
                }}
                autoComplete="off"
                autoFocus
                maxLength="24"
              />

              <fieldset>
                <legend>Profile color</legend>
                <div className="bp-profile-colors">
                  {profileStyles.map((style) => (
                    <button
                      key={style}
                      type="button"
                      className={'bp-profile-color bp-profile-color-' + style + (style === newStyle ? ' is-selected' : '')}
                      onClick={() => setNewStyle(style)}
                      aria-label={'Use ' + style + ' profile color'}
                      aria-pressed={style === newStyle}
                    ></button>
                  ))}
                </div>
              </fieldset>

              {error ? <p className="bp-profile-error" role="alert">{error}</p> : null}

              <div className="bp-profile-editor-actions">
                <button className="bp-profile-save" type="submit">Create Profile</button>
                <button
                  className="bp-profile-cancel"
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    setError('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </main>
    </div>
  );
}
