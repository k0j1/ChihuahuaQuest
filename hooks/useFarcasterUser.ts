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
          // Type assertion to access potential properties not yet in the @farcaster/frame-sdk definition
          // or just safety for verifications
          const contextUser = context.user as any;
          
          setUser({
            fid: contextUser.fid,
            username: contextUser.username,
            displayName: contextUser.displayName,
            pfpUrl: contextUser.pfpUrl,
            verifications: contextUser.verifications || [], // Array of connected addresses
            custodyAddress: contextUser.custodyAddress, // Custody address
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