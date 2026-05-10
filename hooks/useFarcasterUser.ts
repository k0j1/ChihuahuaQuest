import { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';
import { FarcasterUser } from '../types';
import { supabase } from '../lib/supabase';
import { useAccount } from 'wagmi';

export const useFarcasterUser = () => {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  
  const { address: wagmiAddress, isConnected } = useAccount();

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

              const upsertData: any = {
                fid: contextUser.fid,
                username: contextUser.username,
                display_name: contextUser.displayName || null,
                pfp_url: contextUser.pfpUrl || null,
                updated_at: new Date().toISOString(),
              };

              if (address) {
                upsertData.address = address;
              }

              console.log('Attempting to save Farcaster user to Supabase:', upsertData);
              const { error } = await supabase
                .from('farcaster_users')
                .upsert(upsertData, { onConflict: 'fid' });
                
              if (error) {
                console.error('Failed to save user to Supabase:', error);
              } else {
                console.log('Successfully saved user to Supabase:', upsertData);
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

  // Sync vagmi address with supabase if not already saved
  useEffect(() => {
    if (user && isConnected && wagmiAddress && supabase) {
      const isAddressKnown = 
        user.custodyAddress === wagmiAddress || 
        user.verifications?.includes(wagmiAddress);

      if (!isAddressKnown) {
        const updateAddressAndState = async () => {
          console.log('Updating user address in Supabase from wagmi:', { fid: user.fid, address: wagmiAddress });
          try {
            const { error } = await supabase
              .from('farcaster_users')
              .upsert({
                fid: user.fid,
                address: wagmiAddress,
                updated_at: new Date().toISOString(),
              }, { onConflict: 'fid' });

            if (error) {
               console.error('Failed to update address in Supabase:', error);
            } else {
               console.log('Successfully updated address in Supabase.');
               // Update local state to avoid infinite loops and keep user data accurate
               setUser(prev => prev ? {
                   ...prev,
                   verifications: [...(prev.verifications || []), wagmiAddress]
               } : null);
            }
          } catch (err) {
            console.error('Error updating address from wagmi:', err);
          }
        };

        updateAddressAndState();
      }
    }
  }, [user, wagmiAddress, isConnected]);

  return { user, isLoaded, isBlocked, setIsBlocked };
};
