import { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';
import { FarcasterUser } from '../types';
import { supabase } from '../lib/supabase';

export const useFarcasterUser = () => {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

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

          if (supabase) {
            try {
              // Check blocked_users table
              const { data: blockedData, error: blockErr } = await supabase
                .from('blocked_users')
                .select('fid')
                .eq('fid', contextUser.fid)
                .maybeSingle();
                
              if (blockedData) {
                setIsBlocked(true);
              }
              
              let address = (contextUser.verifications && contextUser.verifications.length > 0)
                ? contextUser.verifications[0]
                : contextUser.custodyAddress;

              if (!address && sdk.actions.requestAddresses) {
                console.log('Address not found in context, requesting via SDK...');
                try {
                  const addresses = await sdk.actions.requestAddresses();
                  if (addresses && addresses.length > 0) {
                    address = addresses[0];
                    console.log('Address obtained via SDK:', address);
                  }
                } catch (reqErr) {
                  console.error('Failed to request addresses from SDK:', reqErr);
                }
              }

              if (address) {
                console.log('Attempting to save Farcaster user to Supabase:', { fid: contextUser.fid, address });
                const { error } = await supabase
                  .from('farcaster_users')
                  .upsert(
                    {
                      fid: contextUser.fid,
                      address: address,
                      username: contextUser.username,
                      display_name: contextUser.displayName || null,
                      pfp_url: contextUser.pfpUrl || null,
                      updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'fid' }
                  );
                  
                if (error) {
                  console.error('Failed to save user to Supabase:', error);
                } else {
                  console.log('Successfully saved user to Supabase:', { fid: contextUser.fid, address });
                }
              } else {
                console.warn('Skipping Farcaster user save: Address not found.', {
                  fid: contextUser.fid,
                  verifications: contextUser.verifications,
                  custodyAddress: contextUser.custodyAddress
                });
              }
            } catch (err) {
              console.error('Error during Supabase upsert:', err);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to load Farcaster context:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadUser();
  }, []);

  return { user, isLoaded, isBlocked, setIsBlocked };
};
