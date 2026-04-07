<?php

namespace App\Policies;

use App\Models\Repository;
use App\Models\User;

class RepositoryPolicy
{
    public function view(User $user, Repository $repository): bool
    {
        return $repository->user_id === $user->id;
    }

    public function update(User $user, Repository $repository): bool
    {
        return $repository->user_id === $user->id;
    }
}
