import { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';
import { FarcasterUser } from '../types';

export const useFarcasterUser = () => {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Initialize the frame SDK
        // sdk.actions.ready() tells the parent Farcaster client that the frame is loaded.
        // It's safe to call even if not in a frame (it just won't do much).
        await sdk.actions.ready();

        const context = await sdk.context;
        if (context && context.user) {
          setUser({
            fid: context.user.fid,
            username: context.user.username,
            displayName: context.user.displayName,
            pfpUrl: context.user.pfpUrl,
          });
        }
      } catch (error) {
        console.warn('Failed to load Farcaster context:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadUser();
  }, []);

  return { user, isLoaded };
};