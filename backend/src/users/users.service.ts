import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmailWithPassword(email: string) {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  findAllWithRate() {
    return this.repo.createQueryBuilder('user').addSelect('user.hourlyRate').getMany();
  }

  findOneWithRate(id: string) {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.hourlyRate')
      .where('user.id = :id', { id })
      .getOne();
  }

  count() {
    return this.repo.count();
  }

  async create(data: Partial<User>) {
    const password = data.password ? await bcrypt.hash(data.password, 10) : undefined;
    const user = await this.repo.save(this.repo.create({ ...data, password }));
    delete (user as Partial<User>).password;
    return user;
  }

  async update(id: string, data: Partial<User>) {
    const password = data.password ? await bcrypt.hash(data.password, 10) : undefined;
    await this.repo.update(id, { ...data, ...(password ? { password } : {}) });
    return this.findOne(id);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
