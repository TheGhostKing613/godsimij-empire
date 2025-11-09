interface ProfileCoverProps {
  coverUrl?: string | null;
}

export function ProfileCover({ coverUrl }: ProfileCoverProps) {
  return (
    <div className="h-80 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg relative overflow-hidden">
      {coverUrl && (
        <img
          src={coverUrl}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
