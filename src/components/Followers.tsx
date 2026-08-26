import React from "react";
import { ListGroup, Image, Button } from "react-bootstrap";

interface Follower {
  id: string;
  name: string;
  avatar?: string;
}

export default function Followers({
  followers,
  onRemove,
}: {
  followers: Follower[];
  onRemove?: (id: string) => void;
}) {
  if (!followers || followers.length === 0) {
    return <div className='text-muted'>No followers yet.</div>;
  }

  return (
    <ListGroup>
      {followers.map((f) => (
        <ListGroup.Item key={f.id} className='d-flex align-items-center'>
          <Image
            src={f.avatar || "https://placehold.co/40x40"}
            roundedCircle
            width={40}
            height={40}
            className='me-3'
          />
          <div className='flex-grow-1'>{f.name}</div>
          {onRemove && (
            <Button
              size='sm'
              variant='outline-danger'
              onClick={() => onRemove(f.id)}
            >
              Remove
            </Button>
          )}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
